//@ts-nocheck
import {
    TextureLoader,
    NearestFilter,
    LinearMipMapLinearFilter,
    SRGBColorSpace,
    EquirectangularReflectionMapping,
  } from "three";
  import GifLoader from "three-gif-loader";
  
  import wallImg from "../images/wall.jpg";
  import playerUp from "../images/playerUp.gif";
  import playerDown from "../images/playerDown.gif";
  import playerRight from "../images/playerRight.gif";
  import playerLeft from "../images/playerLeft.gif";
  import playerIdle from "../images/playerIdle.gif";
  import coinImg from "../images/coin.gif";
  import chestImg from "../images/chest.png";
  import orbImg from "../images/orb.gif";
  import bombImg from "../images/bomb.gif";
  
  // instantiate GifLoader
  const gifLoader = new GifLoader();
  const pngLoader = new TextureLoader();
  
  function imgLoader(path, type) {
    let image;
  
    if (type === "gif") {
      image = gifLoader.load(path);
    } else {
      image = pngLoader.load(path);
    }
  
    // options
    image.mapping = EquirectangularReflectionMapping;
    image.colorSpace = SRGBColorSpace;
    image.magFilter = NearestFilter;
    image.minFilter = LinearMipMapLinearFilter;
  
    return image;
  }
  
  const wood = imgLoader(wallImg, "png");
  const playerUpMovement = imgLoader(playerUp, "gif");
  const playerDownMovement = imgLoader(playerDown, "gif");
  const playerRightMovement = imgLoader(playerRight, "gif");
  const playerLeftMovement = imgLoader(playerLeft, "gif");
  const playerIdleMovement = imgLoader(playerIdle, "gif");
  const coin = imgLoader(coinImg, "gif");
  const chest = imgLoader(chestImg, "png");
  const orb = imgLoader(orbImg, "gif");
  const bomb = imgLoader(bombImg, "gif");
  
  export {
    playerUpMovement,
    playerDownMovement,
    playerRightMovement,
    playerLeftMovement,
    playerIdleMovement,
    wood,
    coin,
    chest,
    orb,
    bomb,
  };