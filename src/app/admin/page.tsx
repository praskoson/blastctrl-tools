const getAssetsByOwner = async () => {
  const response = await fetch(process.env.NEXT_PUBLIC_DAS_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: "my-id",
      method: "searchAssets",
      params: {
        tokenType: "fungible",
        ownerAddress: "86J52egGfkzDmByk961appyevaJ5BqaATXzKMRXCPyZJ",
        page: 1,
        limit: 100,
      },
    }),
  });
  const { result } = await response.json();
  return result;
};

export default async function AdminPage() {
  const res = await getAssetsByOwner();
  return (
    <div>
      <p>This is where admins be</p>
      <div className="my-4">
        <pre>{JSON.stringify(res, null, 2)}</pre>
      </div>
    </div>
  );
}
