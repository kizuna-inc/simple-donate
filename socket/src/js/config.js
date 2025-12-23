const config = async () => {
  const call = await (await fetch("/config")).json();

  return call;
};
