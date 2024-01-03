###This simple bash script will replace the dev_latest image with whichever image you'd like.

read -p "Enter image tag " image

read -p "Continue? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1

sed -i.bak "s#dev_latest#$image#g" ../rairnode.yaml
sed -i.bak "s#dev_latest#$image#g" ../minting-network.yaml
sed -i.bak "s#dev_latest#$image#g" ../blockchain-event-listener.yaml
sed -i.bak "s#dev_latest#$image#g" ../media-service.yaml