package teams

import (
	"context"
	"testing"
	"time"

	"github.com/keybase/client/go/libkb"
	"github.com/keybase/client/go/protocol/keybase1"
	"github.com/stretchr/testify/require"
)

// See CORE-8860. We should be able to audit a stale team. That is, ever the merkle tree
// is advertising a tail at 5, and we're only loaded through 3 (due to an unbusted cache),
// the audit should still succeed.
func TestAuditStaleTeam(t *testing.T) {

	fus, tcs, cleanup := setupNTests(t, 5)
	defer cleanup()

	t.Logf("create team")
	teamName, _ := createTeam2(*tcs[0])
	m := make([]libkb.MetaContext, 5)
	for i, tc := range tcs {
		m[i] = libkb.NewMetaContextForTest(*tc)
	}

	// We set up codenames for 3 users, A, B, C, D and E
	const (
		A = 0
		B = 1
		C = 2
		D = 3
		E = 4
	)

	t.Logf("A adds B to the team as an admin")
	_, err := AddMember(m[0].Ctx(), tcs[0].G, teamName.String(), fus[1].Username, keybase1.TeamRole_ADMIN, nil)
	require.NoError(t, err)

	load := func(asUser int) {
		_, err = Load(m[asUser].Ctx(), tcs[asUser].G, keybase1.LoadTeamArg{
			Name:    teamName.String(),
			Public:  false,
			StaleOK: true,
		})
		require.NoError(t, err)
	}

	addC := func(asUser int) {
		_, err = AddMember(m[asUser].Ctx(), tcs[asUser].G, teamName.String(), fus[C].Username, keybase1.TeamRole_READER, nil)
		require.NoError(t, err)
	}

	addD := func(asUser int) {
		_, err = AddMember(m[asUser].Ctx(), tcs[asUser].G, teamName.String(), fus[D].Username, keybase1.TeamRole_BOT, nil)
		require.NoError(t, err)
	}

	addE := func(asUser int) {
		_, err = AddMember(m[asUser].Ctx(), tcs[asUser].G, teamName.String(), fus[E].Username, keybase1.TeamRole_RESTRICTEDBOT, &keybase1.TeamBotSettings{})
		require.NoError(t, err)
	}

	rmC := func(asUser int) {
		err = RemoveMember(m[asUser].Ctx(), tcs[asUser].G, teamName.String(), fus[C].Username)
		require.NoError(t, err)
	}

	rmD := func(asUser int) {
		err = RemoveMember(m[asUser].Ctx(), tcs[asUser].G, teamName.String(), fus[D].Username)
		require.NoError(t, err)
	}

	rmE := func(asUser int) {
		err = RemoveMember(m[asUser].Ctx(), tcs[asUser].G, teamName.String(), fus[E].Username)
		require.NoError(t, err)
	}

	setFastAudits := func(m libkb.MetaContext) {
		// do a lot of probes so we're likely to find issues
		m.G().Env.Test.TeamAuditParams = &libkb.TeamAuditParams{
			NumPostProbes:         10,
			MerkleMovementTrigger: keybase1.Seqno(1),
			RootFreshness:         time.Duration(1),
			LRUSize:               500,
			NumPreProbes:          3,
			Parallelism:           3,
		}
	}

	setSlowAudits := func(m libkb.MetaContext) {
		m.G().Env.Test.TeamAuditParams = &libkb.TeamAuditParams{
			NumPostProbes:         1,
			MerkleMovementTrigger: keybase1.Seqno(1000000),
			RootFreshness:         time.Hour,
			LRUSize:               500,
			NumPreProbes:          3,
			Parallelism:           3,
		}
	}

	// A adds C, D and E to the team and triggers an Audit
	setFastAudits(m[A])
	addC(A)
	addD(A)
	addE(A)

	// A removes C, D and E from the team, and loads the team, but does *not* trigger an audit
	setSlowAudits(m[A])
	rmC(A)
	rmD(A)
	rmE(A)
	load(A)

	t.Logf("User B rotates the key a bunch of times")

	// B rotates the key by adding and remove C a bunch of times.
	for i := 0; i < 3; i++ {
		addC(B)
		rmC(B)
	}

	// A forces local idea of what the max merkle sequence number is.
	_, err = tcs[A].G.MerkleClient.FetchRootFromServerBySeqno(m[A], keybase1.Seqno(100000000))
	require.NoError(t, err)

	// A forces an audit on a stale team.
	setFastAudits(m[A])
	t.Logf("User A loading the team, and auditing on an primed cached")
	load(A)
}

func TestAuditRotateAudit(t *testing.T) {
	fus, tcs, cleanup := setupNTests(t, 4)
	defer cleanup()

	t.Logf("create team")
	teamName, teamID := createTeam2(*tcs[0])
	m := make([]libkb.MetaContext, 4)
	for i, tc := range tcs {
		m[i] = libkb.NewMetaContextForTest(*tc)
	}

	// We set up codenames for 3 users, A, B, C, and D
	const (
		A = 0
		B = 1
		C = 2
		D = 3
	)

	load := func() {
		_, err := Load(m[A].Ctx(), tcs[A].G, keybase1.LoadTeamArg{
			Name:        teamName.String(),
			Public:      false,
			ForceRepoll: true,
		})
		require.NoError(t, err)
	}

	addB := func() keybase1.Seqno {
		_, err := AddMember(m[A].Ctx(), tcs[A].G, teamName.String(), fus[B].Username, keybase1.TeamRole_READER, nil)
		require.NoError(t, err)
		return 1
	}

	addC := func() keybase1.Seqno {
		_, err := AddMember(m[A].Ctx(), tcs[A].G, teamName.String(), fus[C].Username, keybase1.TeamRole_BOT, nil)
		require.NoError(t, err)
		return 1
	}

	addD := func() keybase1.Seqno {
		_, err := AddMember(m[A].Ctx(), tcs[A].G, teamName.String(), fus[D].Username, keybase1.TeamRole_RESTRICTEDBOT, &keybase1.TeamBotSettings{})
		require.NoError(t, err)
		// adding a RESTRICTEDBOT adds an additional bot_settings link
		return 2
	}

	rmB := func() keybase1.Seqno {
		err := RemoveMember(m[A].Ctx(), tcs[A].G, teamName.String(), fus[B].Username)
		require.NoError(t, err)
		return 1
	}

	rmC := func() keybase1.Seqno {
		err := RemoveMember(m[A].Ctx(), tcs[A].G, teamName.String(), fus[C].Username)
		require.NoError(t, err)
		return 1
	}

	rmD := func() keybase1.Seqno {
		err := RemoveMember(m[A].Ctx(), tcs[A].G, teamName.String(), fus[D].Username)
		require.NoError(t, err)
		return 1
	}

	setFastAudits := func() {
		// do a lot of probes so we're likely to find issues
		m[A].G().Env.Test.TeamAuditParams = &libkb.TeamAuditParams{
			NumPostProbes:         10,
			MerkleMovementTrigger: keybase1.Seqno(1),
			RootFreshness:         time.Duration(1),
			LRUSize:               500,
			NumPreProbes:          3,
			Parallelism:           3,
		}
	}

	assertAuditTo := func(n keybase1.Seqno) {
		auditor := m[A].G().GetTeamAuditor().(*Auditor)
		history, err := auditor.getFromCache(m[A], teamID, auditor.getLRU())
		require.NoError(t, err)
		require.Equal(t, n, lastAudit(history).MaxChainSeqno)
	}

	setFastAudits()
	actions := []func() keybase1.Seqno{addB, rmB, addC, rmC, addD, rmD}
	expectedSeqno := keybase1.Seqno(1)
	for _, action := range actions {
		expectedSeqno += action()
		load()
		assertAuditTo(expectedSeqno)
	}
}

type CorruptingMerkleClient struct {
	libkb.MerkleClientInterface

	corruptor func(leaf *libkb.MerkleGenericLeaf, root *libkb.MerkleRoot, err error) (*libkb.MerkleGenericLeaf, *libkb.MerkleRoot, error)
}

func (c CorruptingMerkleClient) LookupLeafAtSeqnoForAudit(m libkb.MetaContext, leafID keybase1.UserOrTeamID, s keybase1.Seqno) (leaf *libkb.MerkleGenericLeaf, root *libkb.MerkleRoot, err error) {
	return c.corruptor(c.MerkleClientInterface.LookupLeafAtSeqnoForAudit(m, leafID, s))
}

var _ libkb.MerkleClientInterface = CorruptingMerkleClient{}

func TestAuditFailsIfDataIsInconsistent(t *testing.T) {
	fus, tcs, cleanup := setupNTests(t, 2)
	defer cleanup()

	t.Logf("create team")
	teamName, teamID := createTeam2(*tcs[0])
	m := make([]libkb.MetaContext, 2)
	for i, tc := range tcs {
		m[i] = libkb.NewMetaContextForTest(*tc)
	}

	// We set up codenames for 2 users, A, B
	const (
		A = 0
		B = 1
	)

	add := func(adder, addee int) keybase1.Seqno {
		_, err := AddMember(m[adder].Ctx(), tcs[adder].G, teamName.String(), fus[addee].Username, keybase1.TeamRole_READER, nil)
		require.NoError(t, err)
		return 1
	}

	setFastAudits := func(user int) {
		// do a lot of probes so we're likely to find issues
		m[user].G().Env.Test.TeamAuditParams = &libkb.TeamAuditParams{
			NumPostProbes:         10,
			MerkleMovementTrigger: keybase1.Seqno(1),
			RootFreshness:         time.Duration(1),
			LRUSize:               500,
			NumPreProbes:          3,
			Parallelism:           3,
		}
	}

	assertAuditTo := func(user int, n keybase1.Seqno) {
		auditor := m[user].G().GetTeamAuditor().(*Auditor)
		history, err := auditor.getFromCache(m[user], teamID, auditor.getLRU())
		require.NoError(t, err)
		require.Equal(t, n, lastAudit(history).MaxChainSeqno)
	}

	setFastAudits(B)

	// A adds B to the team
	add(A, B)

	team, err := GetForTestByStringName(context.TODO(), m[A].G(), teamName.String())
	require.NoError(t, err)
	root := m[A].G().GetMerkleClient().LastRoot(m[A])
	require.NotNil(t, root)

	merkle := m[B].G().GetMerkleClient()
	corruptMerkle := CorruptingMerkleClient{
		MerkleClientInterface: merkle,
		corruptor: func(leaf *libkb.MerkleGenericLeaf, root *libkb.MerkleRoot, err error) (*libkb.MerkleGenericLeaf, *libkb.MerkleRoot, error) {
			t.Logf("Corruptor: received %v,%v,%v", leaf, root, err)
			if leaf != nil && leaf.Private != nil && len(leaf.Private.LinkID) > 0 {
				leaf.Private.LinkID[0] ^= 0xff
				t.Logf("Corruptor: altering LINKID for %v", leaf.Private.Seqno)
			}
			return leaf, root, err
		},
	}
	m[B].G().SetMerkleClient(corruptMerkle)

	auditor := m[B].G().GetTeamAuditor().(*Auditor)
	err = auditor.AuditTeam(m[B], teamID, false, team.MainChain().Chain.HeadMerkle.Seqno, team.MainChain().Chain.LinkIDs, team.MainChain().Chain.LastSeqno, root, keybase1.AuditMode_STANDARD)
	require.Error(t, err)
	require.IsType(t, AuditError{}, err)
	require.Contains(t, err.Error(), "team chain linkID mismatch")

	// repeat a second time to ensure that a failed audit is not cached (and thus skipped the second time)
	err = auditor.AuditTeam(m[B], teamID, false, team.MainChain().Chain.HeadMerkle.Seqno, team.MainChain().Chain.LinkIDs, team.MainChain().Chain.LastSeqno, root, keybase1.AuditMode_STANDARD)
	require.Error(t, err)
	require.IsType(t, AuditError{}, err)
	require.Contains(t, err.Error(), "team chain linkID mismatch")

	corruptMerkle = CorruptingMerkleClient{
		MerkleClientInterface: merkle,
		corruptor: func(leaf *libkb.MerkleGenericLeaf, root *libkb.MerkleRoot, err error) (*libkb.MerkleGenericLeaf, *libkb.MerkleRoot, error) {
			t.Logf("Corruptor: received %v,%v,%v", leaf, root, err)
			if leaf != nil && leaf.Private != nil && len(leaf.Private.LinkID) > 0 {
				leaf.Private.Seqno += 5
				t.Logf("Corruptor: altering Seqno, leaf = %+v", leaf)
			}
			return leaf, root, err
		},
	}
	m[B].G().SetMerkleClient(corruptMerkle)

	err = auditor.AuditTeam(m[B], teamID, false, team.MainChain().Chain.HeadMerkle.Seqno, team.MainChain().Chain.LinkIDs, team.MainChain().Chain.LastSeqno, root, keybase1.AuditMode_STANDARD)
	require.Error(t, err)
	require.IsType(t, AuditError{}, err)
	require.Contains(t, err.Error(), "team chain rollback")

	//now let's make sure without any interference the audit succeeds
	m[B].G().SetMerkleClient(merkle)
	err = auditor.AuditTeam(m[B], teamID, false, team.MainChain().Chain.HeadMerkle.Seqno, team.MainChain().Chain.LinkIDs, team.MainChain().Chain.LastSeqno, root, keybase1.AuditMode_STANDARD)
	require.NoError(t, err)
	assertAuditTo(B, 2)
}
