# Kubernetes Deployment Guide

This guide outlines the steps for setting up a Kubernetes deployment for our projects. Follow these steps carefully to ensure that the deployment is configured correctly and safely.

## Prerequisites

1. **Select or Create a Cluster**  
   - Use the development cluster for staging deployments.  
     ```
     # Example: Selecting a predefined cluster
     gcloud container clusters get-credentials dev-cluster --zone us-central1-a --project your-project-id
     ```

2. **Create a Namespace**  
   - Use the following command to create a new namespace:
     ```
     kubectl create namespace $NAME
     ```

3. **Create a Dedicated IP Address**  
   - Reserve a global IP address in Google Cloud:
     ```
     gcloud compute addresses create $IP --global
     ```

4. **Prepare Deployment Directory**  
   - Create a folder structure to organize deployment files.

5. **Adjust Necessary Variables**  
   - This includes setting up external services like Google Analytics.

6. **Configure Secrets**  
   - Place your secrets configuration in the following directory:
     ```
     ./configmaps/environment/secrets
     ```

7. **Set Default Namespace (Safety Measure)**  
   - To avoid accidental deployments to the wrong namespace, set the default namespace context:
     ```
     kubectl config set-context --current --namespace=<insert-namespace-name-here>
     ```

---

## Deployment Steps

**Ensure you are on the correct cluster and environment before proceeding with the deployment commands.**

---

### Apply Configuration

1. **Apply ConfigMap**
   - Load configuration maps into the cluster:
     ```
     kubectl apply -f ./configmaps/environment/$environment/
     ```

2. **Apply Secrets**
   - Apply the secrets configuration:
     ```
     kubectl apply -f secrets.yaml
     ```

3. **Apply Main Manifests**
   - Deploy the main Kubernetes manifests:
     ```
     kubectl apply -f ./manifests/
     ```

### Update DNS Settings

- **Update DNS in Cloudflare** (if relevant)
  - Use Terraform to update DNS settings with new IP addresses in Cloudflare.

### Final Steps

- **Verify Deployment**
  - Check all services and deployments are up and running correctly.
  - Ensure that networking configurations like load balancers and IP addresses are functioning as expected.

This guide serves as a basic walkthrough for deploying services using Kubernetes in our infrastructure. Make sure to customize and expand upon this template to fit the specific needs and complexities of your projects.
