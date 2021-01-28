# Adding new media to RAIR

## Convert MP4

1. Install `ffmpeg` for your OS.

2. Convert an MP4 video to an unencrypted HLS stream
```shell
mkdir output && ffmpeg -i input.mp4 -profile:v baseline -level 3.0 -start_number 0 -hls_time 10 -hls_list_size 0 -f hls output/stream.m3u8 
```

## Create a NFT to control access (optional)

1. Visit https://app.rarible.com/create and create a new NFT (or use an existing one). Accounts holding this NFT will have access to the media via a decrypt node
2. Take note of the NFT identifier. This will be a contract address and a token index. This can be copied from the rarible URL looking at a token (e.g. 0xd07dc4262bcdbf85190c01c996b4c06a461d2430:50984).

## Rare-ify

RARe-ify the stream by encrypting and writing a rair.json with the metadata

```
npm install -g rareify
rareify /path/to/output
```

This will encrypt and write a key file to the same directory.

## Upload to IPFS

Reccomended way is using pinata. 

1. Visit https://pinata.cloud,
2. Upload directory -> select the output directory from above.
3. Copy the CID for the directory (e.g. QmfCSVRK2UMGmu6fLcJzZqZf7sKBdyUPBTDnQ1AesZ2ZCD)

This may take some time depending on the size

## Manually register with node

1. Have the directory CID and .key file ready
1. Visit the upload portal (e.g. http://demo.rair.tech/add_media)
2. Paste the CID from above and upload the .key file, submit!

The last step may take a while as the node has to locate the media on IPFS and pin it. If it times out just try again.

You can now stream the encrypted media via this RAIR node!
