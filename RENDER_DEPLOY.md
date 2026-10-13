# Deploy Navarathiri on Render

The repository contains a Render Blueprint at `render.yaml`. It is set up to create one free Node service and one free Postgres database in Singapore. **No Render resources are created until you run the steps below.**

## Deploy from the private GitHub repo

1. Sign in to [Render](https://dashboard.render.com/). Choose **New + → Blueprint**.
2. Connect GitHub if prompted, choose `SRIVISHNU-SNS/navarathiri-student-participation`, and select the `main` branch.
3. During the Blueprint setup, enter your organiser code privately for the `ADMIN_PIN` secret prompt. Do not add it to GitHub or paste it into client code. Render generates the `SESSION_SECRET` and connects the web service to the database through the private connection string automatically.
4. Review the resources; both plans are `Free`, both regions are Singapore. Choose **Apply** and wait for the web service's first deploy to become **Live**.
5. Open the service's Render URL. Participants use the home page to submit; the organiser visits `/admin` and enters the code. The dashboard's **CSV** action downloads registrations before the temporary database expires.
6. Later commits pushed to `main` can deploy automatically through Render's linked GitHub service.

## Free plan limits to plan around

- Render documents Free resources as suitable for testing and hobby projects, not production use. Free Postgres has no backups and Render permits only one active Free database per workspace, so export the CSV regularly.
- Render Free Postgres has **1 GB** of storage and expires **30 days after it is created**. After expiry it is inaccessible unless upgraded. If it is not upgraded during Render's following **14-day grace period**, Render deletes the database and its data. Export the registrations from `/admin` before expiry; the Blueprint does not create a backup.
- A Free web service sleeps after about **15 minutes** without traffic. Its first request after sleep can take about **a minute** to wake.
- The website has no artificial limit of 50 registrations, but the Free database is temporary. Set a calendar reminder for the export/expiry date when deploying.

For live platform terms, see [Render Free instances](https://render.com/docs/free) and the [Render Blueprint specification](https://render.com/docs/blueprint-spec).
