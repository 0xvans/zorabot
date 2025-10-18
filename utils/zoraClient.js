import fetch from "node-fetch";

export async function getNewCreators() {
  const payload = {
    hash: "c2b3a1f16014905782a54053dc5a0aa4",
    operationName: "TabsQueriesProvider_ExploreQuery",
    variables: { first: 18, listType: "NEW_CREATORS" }
  };

  const res = await fetch("https://api.zora.co/universal/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  const edges = json?.data?.exploreList?.edges || [];

  return edges.map(({ node }) => ({
    name: node.displayName,
    handle: node.creatorProfile?.handle,
    address: node.creatorCoin?.address,
    avatar: node.avatar?.downloadableUri,
    createdAt: node.createdAt,
    marketCap: node.marketCap,
    socials: node.creatorProfile?.socialAccounts || {},
    followers: {
      zora: node.creatorProfile?.followerCount ?? 0,
      twitter: node.creatorProfile?.socialAccounts?.twitter?.followerCount ?? 0,
      farcaster: node.creatorProfile?.socialAccounts?.farcaster?.followerCount ?? 0,
      instagram: node.creatorProfile?.socialAccounts?.instagram?.followerCount ?? 0,
      tiktok: node.creatorProfile?.socialAccounts?.tiktok?.followerCount ?? 0
    }
  }));
}
