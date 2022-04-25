const mongoose = require('mongoose');

const { Schema } = mongoose;

/*
	From https://docs.opensea.io/docs/metadata-standards

	image:
	This is the URL to the image of the item. Can be just about any type of image
	(including SVGs, which will be cached into PNGs by OpenSea), and can be IPFS URLs
	or paths. We recommend using a 350 x 350 image.

	image_data
	Raw SVG image data, if you want to generate images on the fly (not recommended).
	Only use this if you're not including the image parameter.

	external_url
	This is the URL that will appear below the asset's image on OpenSea and will
	allow users to leave OpenSea and view the item on your site.

	description
	A human readable description of the item. Markdown is supported.

	name
	Name of the item.

	attributes
	These are the attributes for the item, which will show up on the OpenSea page for the item. (see below)

	background_color
	Background color of the item on OpenSea. Must be a six-character hexadecimal without a pre-pended #.

	animation_url
	A URL to a multi-media attachment for the item. The file extensions GLTF, GLB, WEBM, MP4, M4V, OGV,
	and OGG are supported, along with the audio-only extensions MP3, WAV, and OGA.

	Animation_url also supports HTML pages, allowing you to build rich experiences and interactive
	NFTs using JavaScript canvas, WebGL, and more. Scripts and relative paths within the HTML
	page are now supported. However, access to browser extensions is not supported.

	youtube_url
	A URL to a YouTube video.
*/

const TokenMetadata = new Schema({
	image: { type: String, required: true, default: process.env.DEFAULT_PRODUCT_COVER },
	image_data: { type: String, required: false },
	external_url: { type: String, required: false },
	description: { type: String, required: false },
	name: { type: String, required: false },
	attributes: { type: [{
		display_type: { type: String, required: false },
		trait_type: { type: String, required: false },
		value: { type: String, required: true }
	}], required: false },
	background_color: { type: String, required: false },
	animation_url: { type: String, required: false },
	youtube_url: { type: String, required: false }
}, { timestamps: false });

module.exports = TokenMetadata;
