async function updateVercelEdgeConfig(key, value) {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${process.env.VERCEL_API_TOKEN}`);
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    items: [
      {
        operation: "update",
        key,
        value,
      },
    ],
  });

  const requestOptions = {
    method: "PATCH",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const response = await fetch(
    "https://api.vercel.com/v1/edge-config/ecfg_p30aquorvoczki9nxac4hls9lvkz/items?teamId=explorers",
    requestOptions
  );
  const result = await response.text();
  console.log(result);
}

// storeToVercelEdgeConfig("item_1", "pera detlic");

module.exports = updateVercelEdgeConfig;
