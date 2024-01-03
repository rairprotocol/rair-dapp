###This reverts images to the last iteration of the images.

echo "This script will revert your images to the most recent iteration using the created .bak files"
read -p "Continue? (Y/N): " confirm && [[ $confirm == [yY] || $confirm == [yY][eE][sS] ]] || exit 1

mv ../blockchain-event-listener.yaml.bak ../blockchain-event-listener.yaml
mv ../rairnode.yaml.bak ../rairnode.yaml
mv ../minting-network.yaml.bak ../minting-network.yaml
mv ../media-service.yaml.bak ../media-service.yaml