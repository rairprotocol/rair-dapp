## Running your own kubernetes instance


### *Requires gcloud and kubectl*

---

### Dependencies

[Installation of gcloud](https://cloud.google.com/sdk/docs/install)

[Installation of kubectl](https://kubernetes.io/docs/tasks/tools/)

*I also recommend the kubernetes extensions for vscode - ms-kubernetes-tools.vscode-kubernetes-tools*
[vscode kubernetes extension](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools)

---

**Please contact devops for a copy of the secrets.yaml file required to deploy the entire kubernetes instance.  This is gitignored for security reasons.**

---


In command line, run the following connection script to connect to the proper cluster.
- [ ]`gcloud container clusters get-credentials dev --zone us-east1-b --project rair-market`
This will connect and authenticate you with the dev cluster.


Next, you will want to create your unique namespace to prevent from conflicting with other developers.
- [ ]`kubectl create namespace $UNIQUE_NAMESPACE`
This creates the unique namespace you will be working within.


Configure your environment to default to this new namespace
- [ ]`kubectl config set-context --current --namespace=$UNIQUE_NAMESPACE`
This will default all kubectl commands to interact within your designated namespace.

*It is recommended to use the -n flag with your namespace to ensure you working in the correct environment*

- [ ]Once your environment is configured, place the secrets.yaml file in the kubernetes-manifests/dev-testing-deployment directory.

---

Once all the above steps are completed, deploy the environment.

Images are deployed from the rair dockerhub.  The secrets.yaml file includes permissions to pull images from these private repositories.  You can find the image names in the following locations *(at the time of this readme)*:

> kubernetes-manifests/dev-testing-deployment/minting-network.yaml line 52
kubernetes-manifests/dev-testing-deployment/media-service.yaml line 49
kubernetes-manifests/dev-testing-deployment/rairnode.yaml line 52
kubernetes-manifests/dev-testing-deployment/blockchain-event-listener.yaml line 50

Utility scripts have been added in the ./commands directory to update images at once.  This will also revert them to the dev_latest state.

### *Please don't commit new images to the repository*

All environment variables are stored in the appropriate configmap files.  Anything that needs to be adjusted here needs to be done ==before deployment==. 
###*Changed configmaps will not be applied until a new image is built*

---

## Deploy the environment!

In the dev-testing-deployment directory, run the following command-
`kubectl apply -f . -n $UNIQUE_NAMESPACE`

This will create all appropriate resources, provision your environment, and create deployments.  This will generate a custom IP address which is accessible via the ingress.  You can find this deployments with:

`kubectl get ingress -n $UNQIQUE_NAMESPACE`

This should give you something similar to the follwing:

> NAME           CLASS    HOSTS   ADDRESS         PORTS   AGE
> rair-ingress   <none>   *       34.120.194.63   80      3h38m

---

# CLEANUP

To delete all objects in your namespace when you are done using them, or to clean your environment, run

`kubectl delete -n <namespace-name> --all`

**THIS DELETES ALL RESOURCES IN CURRENT NAMESPACE, PLEASE MAKE SURE YOU ARE USING THE PROPER NAMESPACE**

*If you wish to do a complete clean of the namespace, you can also just delete the namespace.  Upon recreating the namespace, everything should be gone.*

---

# *Don't run the following command unless you know what you are doing.*

`kubectl delete namespace {namespace}`