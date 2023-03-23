export function checkIPFSanimation(
  link = `ipfs://bafybeigims7nqm7iz7gtymqpel6gtaftrmfn53ahj7kskf6p7jytllnttm?id=1`
) {
  const req = /ipfs:\/\//g;

  const val = link.match(req);

  if (val && val[0] === 'ipfs://') {
    const arr = link.split('//').filter((el) => el !== 'ipfs:');
    console.info('https://ipfs.io/ipfs/' + arr[0], '123');
    return 'https://ipfs.io/ipfs/' + arr[0];
  } else {
    return link;
  }
}
