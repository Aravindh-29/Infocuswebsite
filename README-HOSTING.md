# INFOCUS — Run locally and publish the website

Step-by-step instructions for Windows, Linux, Netlify and your own server.

Prepared for this project on **8 November 2026**.

## 1. Choose what you want to do

| Your goal                                              | Follow this section                                             |
| ------------------------------------------------------ | --------------------------------------------------------------- |
| Open and edit the website on a Windows computer        | [Windows local setup](#3-run-locally-on-windows)                |
| Open and edit the website on a Linux computer          | [Linux local setup](#4-run-locally-on-linux)                    |
| Publish quickly without managing a server              | [Netlify manual upload](#6-publish-on-netlify--manual-upload)   |
| Publish automatically when you update a Git repository | [Netlify Git deployment](#7-publish-on-netlify--from-git)       |
| Use a Windows Server                                   | [Windows Server with IIS](#8-host-on-windows-server-with-iis)   |
| Use an Ubuntu or Debian server                         | [Linux server with Nginx](#9-host-on-a-linux-server-with-nginx) |

**The simplest first deployment is Netlify manual upload.** Build the website, upload the `out` folder, and open the URL Netlify provides.

## 2. Understand the folders first

This is a Next.js website configured as a **static export**. Building turns the source code into ready-to-host HTML, CSS, JavaScript and image files. Animations and interactive features still run in the visitor's browser. See the [Next.js static export guide](https://nextjs.org/docs/app/guides/static-exports).

| Item                                 | What it is                                     | Upload to a static web host?                                    |
| ------------------------------------ | ---------------------------------------------- | --------------------------------------------------------------- |
| `app`, `components`, `lib`, `public` | Source code and original website assets        | No; these are used to build the website                         |
| `package.json`, `package-lock.json`  | Build commands and dependency versions         | No; keep them in your source project                            |
| `emails.json`                        | Editable enquiry recipient list                | No separate upload; its addresses are included during the build |
| `node_modules`                       | Installed development dependencies             | No                                                              |
| `.next`                              | Intermediate Next.js build files               | No                                                              |
| `out`                                | Complete, built website                        | **Yes — upload all its contents**                               |
| `output/infocus-renewed-static.zip`  | A packaged copy of a previous successful build | Yes, after extracting it; rebuild/repackage after changes       |
| Other files in `output`              | Screenshots, earlier exports and logo kits     | No                                                              |

The source project and the upload folder are different things. Keep your source project as your editable master copy. You cannot make normal React code changes using only the deployment ZIP.

For building, use **Node.js 24.x LTS**. This project was successfully built here with Node.js **24.18.0** and npm **11.16.0**. Node.js is needed on the computer that builds the project; IIS, Nginx and Netlify manual uploads do not need a running Node.js process to serve the built files.

## 3. Run locally on Windows

### Step 1 — Install Node.js

1. Open the [official Node.js download page](https://nodejs.org/en/download).
2. Select Node.js **24.x LTS**, Windows, and the installer matching your computer, normally **x64 `.msi`**.
3. Run the installer and keep the option to add Node.js to PATH enabled. npm is included.
4. Close and reopen PowerShell after installation.
5. Check the installation:

```powershell
node --version
npm.cmd --version
```

`npm.cmd` is used in these Windows examples to avoid the common PowerShell restriction on `npm.ps1`.

### Step 2 — Open the project folder

On your current computer, run:

```powershell
Set-Location -LiteralPath 'C:\Users\aravi\Downloads\deploy-699769952e4c470a83e9e118 1'
```

On another computer, copy or extract the **complete source project**, then replace this path with its new location. Keep quotes around paths containing spaces. The folder must contain `package.json` and `package-lock.json`.

### Step 3 — Install the project dependencies

```powershell
npm.cmd ci
```

Wait until it finishes successfully. An internet connection is needed to download the packages. `npm ci` uses the versions in `package-lock.json`; do not delete that file to fix an installation error. See the [npm ci documentation](https://docs.npmjs.com/cli/v11/commands/npm-ci/).

### Step 4 — Start the development website

```powershell
npm.cmd run dev
```

Open **http://localhost:3000**. Keep PowerShell open while you use the site. Saving a source-code change updates the development website. If the terminal chooses another port because 3000 is busy, use the URL printed there.

Press **Ctrl+C** in PowerShell to stop the website.

### Step 5 — Check the production build

Stop the development command, then run:

```powershell
npm.cmd run build
npm.cmd start
```

Open **http://localhost:4173**. The build creates `out`; `npm start` serves that folder. This preview does not update automatically after source changes: stop it, rebuild, then start it again.

To use another preview port, such as 4174:

```powershell
$env:PORT = '4174'
npm.cmd start
```

Open **http://localhost:4174**. This setting applies to that PowerShell session. Open a new session to return to the default, or run `Remove-Item Env:PORT` after stopping the preview.

The included preview server listens on `127.0.0.1`, so it is for this computer only. Use IIS or Nginx below for public hosting.

## 4. Run locally on Linux

These instructions use **Ubuntu/Debian and Bash**. Other Linux distributions use different package-install commands.

### Step 1 — Install Node.js 24

Install the download tools:

```bash
sudo apt update
sudo apt install curl ca-certificates
```

Install nvm, a tool that installs Node.js for your user account. These commands use the [official nvm installer](https://github.com/nvm-sh/nvm#installing-and-updating):

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.41.0/install.sh -o /tmp/infocus-nvm-install.sh
export NVM_DIR="$HOME/.nvm"
bash /tmp/infocus-nvm-install.sh
. "$NVM_DIR/nvm.sh"
nvm install 24
nvm use 24
nvm alias default 24
```

Run the nvm commands as your normal user, not with `sudo`. Then check:

```bash
node --version
npm --version
```

### Step 2 — Open your project

Copy or extract the complete source project into your home folder. This example assumes you renamed the folder to `infocus`:

```bash
cd "$HOME/infocus"
ls package.json package-lock.json
```

Replace `$HOME/infocus` with your actual project path. Do not copy Windows `node_modules` to Linux; install dependencies on Linux instead.

### Step 3 — Install and start

```bash
npm ci
npm run dev
```

Open **http://localhost:3000** on that computer. Keep the terminal open. Press **Ctrl+C** to stop.

### Step 4 — Check the production build

```bash
npm run build
npm start
```

Open **http://localhost:4173**. For port 4174 instead:

```bash
PORT=4174 npm start
```

This port setting lasts for that command only. Run npm commands as your normal user, not with `sudo`.

## 5. Build the files you will upload

From the source project folder, run:

```text
npm run build
```

On Windows PowerShell, `npm.cmd run build` does the same thing.

Only continue when the build succeeds. It also runs this project's `fix-static-segments.mjs` compatibility step. Use **`npm run build`**, not a separate `next export` command.

Your finished upload folder should look similar to this:

```text
out/
  index.html
  404.html
  _next/
  images/
  font/
  brand/
  brands/
  contact/
    index.html
  services/
    index.html
  solutions/
  about/
  privacy/
  robots.txt
  sitemap.xml
  ...other generated folders and files...
```

**Keep every generated file**, including `_next` and the `__next...txt` files. Uploading only `index.html`, only `public`, or only the images will break the website.

If you already have `output/infocus-renewed-static.zip`, extract it to a new empty folder. The folder you publish must contain `index.html` directly, not another nested `out` folder. Older ZIPs named `infocus-static.zip` and the logo/wordmark kits are not the current website package.

To refresh the provided ZIPs after a successful build, Python 3 must be installed:

```powershell
# Windows, from the source project folder:
python scripts/package-renewal.py
```

```bash
# Linux, from the source project folder:
python3 scripts/package-renewal.py
```

This optional project packaging script also rebuilds the wordmark ZIP and expects the original `output/wordmark` exports to be present. You do **not** need Python or a ZIP to deploy: uploading `out` directly is enough.

## 6. Publish on Netlify — manual upload

### Step 1 — Prepare the website

Build as described above. Open the `out` folder and confirm that `index.html`, `_next`, and the page folders are present.

### Step 2 — Upload

1. Sign in to [Netlify](https://app.netlify.com/).
2. Open [Netlify Drop](https://app.netlify.com/drop), or choose the manual deployment option in your dashboard.
3. Drag the **`out` folder** into the deployment area.
4. If using the deployment ZIP, extract it first and drag the extracted folder containing `index.html` instead.
5. Wait for deployment to finish. Open the generated `https://...netlify.app` address.

For this manual method, upload the already-built files in `out`. You do not need to enter a build command or upload the source project. See [Netlify's manual deployment instructions](https://docs.netlify.com/deploy/create-deploys/#drag-and-drop).

### Step 3 — Check the live pages

Open the homepage, then open `/contact/` and `/services/` directly. Refresh each page. Check the images, navigation, light/dark modes and the Gmail draft flow.

Do not add a rule that rewrites every URL to `/index.html`. This website has a separate generated HTML page for each route.

### Step 4 — Publish an update later

Edit the source, run `npm run build` again, then open the **same Netlify project's Deploys page** and drag the updated `out` folder into its manual deployment area. Keep using the same project to keep the same website address.

## 7. Publish on Netlify — from Git

Use this option if you want Netlify to rebuild the website after you push changes to your repository.

### Step 1 — Put the source project in your repository

Use a GitHub, GitLab, Bitbucket or other Git provider supported by Netlify. The connected repository must contain the current redesigned source, including:

```text
app/
components/
lib/
public/
scripts/
tests/
emails.json
package.json
package-lock.json
next.config.ts
tsconfig.json
next-env.d.ts
.gitignore
```

Include any other root configuration files used by your project. Do not commit `node_modules`, `.next`, passwords or private `.env` files. The `out` folder does not need to be committed; Netlify will build it. A local Git commit alone does not upload anything: push the current source to the repository you connect.

### Step 2 — Connect and configure

1. In Netlify, choose **Add new project → Import an existing project**.
2. Connect your Git provider and select your repository.
3. Choose your actual production branch, such as `main`.
4. Set these values:

| Setting                                         | Value for this project                                  |
| ----------------------------------------------- | ------------------------------------------------------- |
| Base directory                                  | Leave blank if `package.json` is at the repository root |
| Build command                                   | `npm run build`                                         |
| Publish directory                               | `out`                                                   |
| Environment variable `NODE_VERSION`             | `24`                                                    |
| Environment variable `NETLIFY_NEXT_PLUGIN_SKIP` | `true`                                                  |

If the source project is inside a subfolder in your repository, set that subfolder as the base directory. Keep the publish directory as `out` relative to it.

Netlify installs dependencies before building. The plugin-skip setting keeps this deployment static; this project does not need Next.js server rendering on Netlify. Do not add `next export` or change the publish directory to `.next`. See [Netlify build settings](https://docs.netlify.com/build/configure-builds/overview/), [Node version configuration](https://docs.netlify.com/build/configure-builds/manage-dependencies/) and [static Next.js framework settings](https://docs.netlify.com/build/frameworks/overview/).

### Step 3 — Deploy and update

Click the deploy button, wait for the build to finish, then open the provided URL. If it fails, read the first error in the deploy log. After setup, a push to the connected production branch starts a new deployment.

### Step 4 — Add your own domain on Netlify

1. Open the project’s **Domain management** page.
2. Choose **Add domain → Add a domain you already own**.
3. Enter the domain and follow Netlify's verification instructions.
4. At your DNS provider, add or change exactly the website DNS records Netlify shows. Preserve existing mail records such as MX and email-related TXT records.
5. Wait for DNS verification, then check **Domain management → HTTPS**. Netlify provisions and renews the HTTPS certificate after the domain is correctly configured.

Do not copy an IP address from an old tutorial. Use the current values shown for your Netlify project. See [Netlify domain setup](https://docs.netlify.com/manage/domains/configure-domains/bring-a-domain-to-netlify/) and [HTTPS setup](https://docs.netlify.com/manage/domains/secure-domains-with-https/https-ssl/).

## 8. Host on Windows Server with IIS

This section is for **Windows Server 2022/2025 with Desktop Experience** and administrator access. Server Core needs remote IIS administration for these GUI steps. For a regular Windows laptop, use the local setup in section 3. The server will serve the built files using IIS; it does not need Node.js unless you also want to build there.

In the following examples, replace `example.com` with your real domain.

### Step 1 — Build and transfer the website

On your development computer, run `npm run build`. Copy the entire contents of `out` to a temporary folder on the server, for example:

```text
C:\Deploy\infocus-out\index.html
C:\Deploy\infocus-out\_next\
C:\Deploy\infocus-out\contact\index.html
```

You can transfer the folder using your normal server file-transfer method or extract the current static deployment ZIP there.

### Step 2 — Install IIS

Open **Windows PowerShell as Administrator** on the server:

```powershell
Install-WindowsFeature Web-Server -IncludeManagementTools
```

In Server Manager, confirm that **Static Content**, **Default Document**, **HTTP Errors** and **IIS Management Console** are installed. Follow any restart instruction shown by Windows. See the [Microsoft IIS installation guide](https://learn.microsoft.com/en-us/windows-server/networking/core-network-guide/cncg/server-certs/install-the-web-server-web1).

### Step 3 — Copy the files into the web folder

For a new, dedicated website folder:

```powershell
New-Item -ItemType Directory -Path 'C:\inetpub\infocus' -Force
Copy-Item -Path 'C:\Deploy\infocus-out\*' -Destination 'C:\inetpub\infocus' -Recurse -Force
icacls 'C:\inetpub\infocus' /grant 'IIS_IUSRS:(OI)(CI)(RX)' /T
```

Confirm that **`C:\inetpub\infocus\index.html`** exists. It must not be hidden inside `C:\inetpub\infocus\out`.

### Step 4 — Create the IIS website

1. Open **IIS Manager** from Server Manager → Tools.
2. Right-click **Sites → Add Website**.
3. Set the site name to **Infocus**.
4. Set the physical path to **`C:\inetpub\infocus`**.
5. For an initial local test, choose **http**, an unused port such as **8080**, and leave the hostname blank.
6. Select the Infocus site → **Authentication → Anonymous Authentication → Edit**. Choose **Application pool identity**.
7. Start the website, then browse **http://localhost:8080** on the server.

The final identity setting matches the read permissions granted above. See Microsoft's [IIS identity explanation](https://learn.microsoft.com/en-us/troubleshoot/developer/webapps/iis/was-service-svchost-process-operation/understanding-identities).

For public hosting, edit the site's **Bindings** and use HTTP port **80** with hostname **`example.com`**. Add a separate binding for `www.example.com` if you use it. Avoid duplicating another site's IP/port/hostname combination. Keep existing sites intact; visiting only the server IP may show the Default Web Site instead of Infocus. See [IIS static website setup](https://learn.microsoft.com/en-us/iis/manage/creating-websites/scenario-build-a-static-website-on-iis).

### Step 5 — Set default documents and file types

In the Infocus site:

1. Open **Default Document**, enable it, and add or move **`index.html`** to the top.
2. Keep **Directory Browsing** disabled.
3. Open **MIME Types**. Add these mappings **only if they are missing**:

| Extension | MIME type          |
| --------- | ------------------ |
| `.webp`   | `image/webp`       |
| `.woff2`  | `font/woff2`       |
| `.svg`    | `image/svg+xml`    |
| `.json`   | `application/json` |
| `.txt`    | `text/plain`       |

Keep the existing JavaScript, CSS and image mappings. Duplicate MIME entries can cause configuration errors. See [IIS Default Document](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/defaultdocument/) and [IIS MIME types](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/staticcontent/mimemap).

The generated page folders already handle `/contact/` and `/services/`. No catch-all rewrite to the homepage is needed.

### Step 6 — Use the website's 404 page

Open the Infocus site's **Error Pages** settings. Set its **404** response to serve the static file **`404.html`** from the site root, with custom error responses enabled. Keep the response as HTTP 404 rather than a redirect to the homepage.

If managing this in `web.config`, add this inside its existing `<system.webServer>` element. If there is no file, create one with the complete example below. Do not replace unrelated existing IIS settings.

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <httpErrors errorMode="Custom">
      <remove statusCode="404" subStatusCode="-1" />
      <error statusCode="404" subStatusCode="-1"
             path="404.html" responseMode="File" />
    </httpErrors>
  </system.webServer>
</configuration>
```

Use the relative `404.html` path; IIS can restrict absolute custom-error paths. See [Microsoft HTTP Errors settings](https://learn.microsoft.com/en-us/iis/configuration/system.webserver/httperrors/).

### Step 7 — Make the server reachable

1. Point your domain's **A record** to the server's public IPv4 address. Add `www` if required. Only add an AAAA record if IPv6 is configured and working.
2. In Windows Firewall, allow inbound TCP **80** and **443** for the website. Add matching rules in the hosting provider's firewall/security group.
3. If the server is behind a router, forward those ports to the server as well.
4. Open **http://example.com** from another computer and test `/contact/` directly.

For a new server without existing website firewall rules, these elevated PowerShell commands create them:

```powershell
New-NetFirewallRule -DisplayName 'Infocus HTTP' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 80
New-NetFirewallRule -DisplayName 'Infocus HTTPS' -Direction Inbound -Action Allow -Protocol TCP -LocalPort 443
```

See the [Microsoft firewall rule reference](https://learn.microsoft.com/en-us/powershell/module/netsecurity/new-netfirewallrule?view=windowsserver2025-ps) for these command options.

### Step 8 — Enable HTTPS

1. Obtain a trusted TLS certificate covering your domain from your certificate provider or hosting team, including its private key. Include both `example.com` and `www.example.com` when you use both names.
2. In IIS Manager, select the server → **Server Certificates → Import** and import the supplied `.pfx` file.
3. Select Infocus → **Bindings → Add**.
4. Choose **https**, port **443**, the correct hostname and the imported certificate.
5. Enable **Require Server Name Indication** when hosting multiple HTTPS websites on the same IP.
6. Add a second HTTPS binding for `www.example.com` if you use that name, selecting a certificate that covers it.
7. Test **https://example.com** and any configured `www` address from another computer. Arrange certificate renewal with the certificate provider.

This adds HTTPS; it does not automatically redirect HTTP visitors. If you want automatic redirection, configure it through your IIS URL Rewrite setup or your hosting provider after HTTPS works. See Microsoft's [IIS HTTPS setup](https://learn.microsoft.com/en-us/iis/manage/configuring-security/how-to-set-up-ssl-on-iis).

### Step 9 — Update or roll back

Build updates on your development computer. Copy the new `out` contents into a **new folder**, such as `C:\inetpub\infocus-release-002`, and apply the same read permissions. Preserve any site-level `web.config` settings. In IIS → Infocus → **Basic Settings**, change the physical path to that new folder. Test it before removing the old folder. To roll back, change the physical path back.

## 9. Host on a Linux server with Nginx

These commands are for **Ubuntu/Debian with sudo access**. Replace `example.com`, `www.example.com`, `your-user` and `SERVER_IP` with your own values.

### Step 1 — Transfer the built website

Build on your development computer. On the Linux server, prepare an upload folder:

```bash
mkdir -p "$HOME/infocus-upload"
```

From the project folder on a Linux development computer, copy the build using SSH:

```bash
scp -r out/. your-user@SERVER_IP:infocus-upload/
```

If `scp` is missing on an Ubuntu/Debian development computer, install it with `sudo apt install openssh-client`.

From a Windows development computer, you can use an SFTP application such as WinSCP to transfer **all files inside `out`** into `infocus-upload` in the server user's home folder. The result must include `$HOME/infocus-upload/index.html` directly.

You may instead copy the full source to the server, follow section 4 to install Node.js, and run `npm ci` plus `npm run build` there. Node.js is not needed on the server when you transfer an already-built website.

### Step 2 — Install Nginx and copy the files

Run on the Linux server:

```bash
sudo apt update
sudo apt install nginx rsync ufw curl nano
sudo install -d -m 755 /var/www/infocus
sudo rsync -a --chown=root:root --chmod=D755,F644 "$HOME/infocus-upload/" /var/www/infocus/
sudo systemctl enable --now nginx
```

Check the web root:

```bash
ls /var/www/infocus/index.html /var/www/infocus/404.html
```

If you built directly on the server, use `out/` as the rsync source instead, while standing in the project folder. Keep the trailing slash so you copy the contents, not a nested folder. See [Ubuntu Nginx installation](https://ubuntu.com/server/docs/how-to/web-services/install-nginx/).

### Step 3 — Create the website configuration

Open a new configuration file:

```bash
sudo nano /etc/nginx/sites-available/infocus
```

Paste this, replacing the example domains:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;

    root /var/www/infocus;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    error_page 404 /404.html;

    location = /404.html {
        internal;
    }
}
```

Save with **Ctrl+O**, press Enter, then exit with **Ctrl+X**. If the server has IPv6 disabled, omit `listen [::]:80;`.

This serves real page folders and returns a proper 404 for unknown URLs. Do not replace `=404` with `/index.html`. See the [Nginx try_files reference](https://nginx.org/en/docs/http/ngx_http_core_module.html#try_files).

### Step 4 — Enable the website

Create this link **once**:

```bash
sudo ln -s /etc/nginx/sites-available/infocus /etc/nginx/sites-enabled/infocus
```

Check the configuration, then reload only if the check succeeds:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Leave other website configurations intact. A request to the server IP alone might show Nginx's default page; the domain must match `server_name`. Before public DNS is ready, test locally on the server with:

```bash
curl -I -H 'Host: example.com' http://127.0.0.1/contact/
```

Expect `200 OK`. See [Ubuntu Nginx configuration](https://ubuntu.com/server/docs/how-to/web-services/configure-nginx/).

### Step 5 — Allow web traffic and set DNS

Allow the actual SSH port **before** enabling UFW, so you keep access to the server. The example uses SSH port 22; replace it if yours is different.

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

Preserve other required rules on an existing server. Allow TCP 80 and 443 in your hosting provider's firewall as well. See [Ubuntu firewall instructions](https://ubuntu.com/server/docs/how-to/security/firewalls/).

At your DNS provider, point the domain's A record to the server's public IPv4 address. Configure `www` if you use it. Only publish an AAAA record if IPv6 is working. Verify **http://example.com** from another computer before requesting the certificate.

### Step 6 — Enable HTTPS with Certbot

For a server without an existing Certbot installation, use the [official Certbot Nginx instructions](https://certbot.eff.org/instructions?ws=nginx&os=snap). If Certbot is already installed another way, follow that installation's upgrade instructions rather than mixing package managers.

```bash
sudo apt install snapd
sudo snap install --classic certbot
sudo /snap/bin/certbot --nginx -d example.com -d www.example.com --redirect
```

Both domain names must point to this server. Remove `-d www.example.com` if you are not using `www`. Follow the prompts for your contact email and the certificate terms. This command configures HTTPS and redirects HTTP to HTTPS.

Check renewal and the final configuration:

```bash
sudo /snap/bin/certbot renew --dry-run
sudo nginx -t
```

The snap installation schedules renewal. Keep the domain pointed at the server and allow the certificate validation traffic on port 80.

### Step 7 — Verify the public website

```bash
curl -I https://example.com/
curl -I https://example.com/contact/
curl -I https://example.com/services/
curl -I https://example.com/does-not-exist/
```

Known pages should return **200**; the last URL should return **404**. Open the same pages in a browser and check fonts, images and animations.

### Step 8 — Publish updates safely

Build again, then upload the new `out` contents to a new staging folder, such as `$HOME/infocus-upload-002`. Copy them to a new web folder:

```bash
sudo install -d -m 755 /var/www/infocus-release-002
sudo rsync -a --chown=root:root --chmod=D755,F644 "$HOME/infocus-upload-002/" /var/www/infocus-release-002/
```

Change the `root` in the site's current Nginx configuration to `/var/www/infocus-release-002`. If Certbot added more than one server block, update every block for this website that contains that root. Preserve the HTTPS settings Certbot added. Run `sudo nginx -t`, then `sudo systemctl reload nginx` if valid. Keep the previous folder until the new version is checked. To roll back, restore the previous root and reload.

## 10. Contact form and email recipients

The current flow is:

**Customer fills form → Review → Send email → Gmail draft opens → customer clicks Send in Gmail.**

The message includes name, email, phone number, company, service, preferred office and project details. An alternative email-app link is also provided.

The recipients are in the source project's `emails.json`:

```json
{
  "recipients": ["hr@infocuscs.com", "aravindhkumar146@gmail.com"]
}
```

After changing this file, **build and publish again**. Editing a copy on the web server will not change an already-built website.

This flow needs no SMTP password, backend mail service or Netlify Forms configuration. The addresses are visible to customers. The file stores addresses, not received messages. Customers must send the draft themselves; the website cannot confirm delivery. Read [EMAILS.md](EMAILS.md) for more details.

## 11. Before using your final domain

The project's metadata currently uses `https://www.infocuscs.com`. If your final public domain is different, update it in:

- `app/layout.tsx` — metadata base and organization URLs.
- `app/sitemap.ts` — page URLs.
- `app/robots.ts` — sitemap URL.

Then rebuild and publish. These examples host the site at the **domain root**, such as `https://example.com/`. Hosting under a subfolder such as `/infocus/` requires a matching Next.js `basePath` and a fresh build.

## 12. Common problems and simple fixes

| Problem                                                 | What to check                                                                                                                   |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `node` is not recognised                                | Install Node.js 24 and reopen your terminal so PATH is refreshed.                                                               |
| PowerShell says `npm.ps1` cannot run                    | Use `npm.cmd` instead of `npm`; no execution-policy change is needed.                                                           |
| `package.json` cannot be found                          | Change into the source project folder before running npm commands.                                                              |
| Dependency installation fails                           | Keep `package-lock.json`, check your internet connection, and use Node.js 24. Read the first npm error.                         |
| Port is already in use                                  | Use `PORT=4174` for Linux or `$env:PORT = '4174'` for PowerShell before starting the preview.                                   |
| Preview says to build the site first                    | Run `npm run build` successfully, then run `npm start` from the same project root.                                              |
| Local preview shows old changes                         | Development uses port 3000; production preview uses the most recent `out` build. Rebuild the production preview.                |
| The website has no images, fonts or styles              | Upload the complete `out` contents, including `_next`, images, fonts and generated route files.                                 |
| Netlify cannot find the homepage                        | The folder you dropped must contain `index.html` directly. Do not upload the parent project folder.                             |
| Netlify Git build asks for server files or uses `.next` | Check publish directory `out` and `NETLIFY_NEXT_PLUGIN_SKIP=true`. Keep the existing `npm run build` command.                   |
| Netlify upload still shows the old design               | Rebuild, then deploy to the same project's Deploys page. Make sure you did not use an older ZIP.                                |
| IIS gives 403 or access denied                          | Check the physical path, read permissions, Anonymous Authentication identity and `index.html` default document.                 |
| IIS gives 404.3 or a font/image fails                   | Check the missing file's MIME mapping. Do not add duplicate MIME entries.                                                       |
| IIS gives 500.19                                        | Read the configuration error. Check duplicate MIME entries or a locked IIS configuration section with the server administrator. |
| A direct visit to `/contact/` fails                     | Confirm `contact/index.html` was uploaded and the server uses index.html for directories. Avoid a homepage catch-all rewrite.   |
| The server IP shows the default web page                | Browse with the configured domain; review IIS host bindings or Nginx `server_name`.                                             |
| HTTPS certificate creation fails                        | Confirm the exact domain points to this server and public port 80 is reachable. Check any incorrect IPv6 DNS record too.        |
| Gmail does not open automatically                       | Use **Open Gmail draft**, allow the new tab, or choose **Open in email app**. Sign into Gmail if asked.                         |
| No enquiry email arrived                                | The customer must click Send inside Gmail. Check the recipient list, the sender's Sent folder and the recipients' spam folders. |

## 13. Final check after each deployment

1. Open the homepage at the live HTTPS address.
2. Open `/services/` and `/contact/` directly and refresh them.
3. Check the desktop and mobile layouts, images, fonts and navigation.
4. Switch light and dark mode and try the globe/cloud interactions.
5. Fill the contact form with test details and verify the Gmail draft's recipients and content. Send only if you intend to send a test message.
6. Open a made-up URL and confirm that the 404 page appears.
7. Keep the editable source project and the previous working deployment as backups.

The application build and local contact-form checks have passed on the current Windows workspace. The Netlify, IIS and Nginx instructions above were checked against the linked official documentation; no public deployment or installation on a separate server was performed while preparing this guide.

## 14. Run with Docker

The project includes:

- `Dockerfile` — builds with Node.js 24, then copies the finished `out` files into a smaller Nginx image.
- `.dockerignore` — excludes local dependencies, old exports, screenshots and private environment files from the build context.
- `docker/nginx.conf` — serves the pages, assets and custom 404, with Nginx running as a non-root user on port 8080.

This uses Docker's [multi-stage build approach](https://docs.docker.com/build/building/multi-stage/). Node.js is used during the image build; the running website container uses Nginx. You do not need Node.js or npm installed on the host to use this Dockerfile.

### Step 1 — Install and start Docker

- **Windows 10/11:** install [Docker Desktop](https://docs.docker.com/desktop/setup/install/windows-install/), start it, and use **Linux containers**. This Dockerfile uses Linux images.
- **Linux:** install [Docker Engine](https://docs.docker.com/engine/install/) for your distribution and start its service. Use `sudo docker` if your user does not have Docker access.
- **Windows Server:** Docker Desktop is not the Windows Server hosting option. Use a Linux VM with Docker for this image, or use IIS as described in section 8.

Check the installation:

```text
docker version
```

It should show both Client and Server information. If it cannot connect to the Docker daemon, start Docker Desktop or the Docker service first.

### Step 2 — Build the image

Open PowerShell or a Linux terminal in the source project folder containing `Dockerfile`, then run:

```text
docker build --pull -t infocus-website:latest .
```

Keep the final dot: it means to build using this project folder. The first build needs internet access to download the base images and npm packages. It runs `npm ci` and `npm run build` inside Docker, so you do not need to build `out` separately.

### Step 3 — Start a local container

The same command works in PowerShell and Bash:

```text
docker run -d --name infocus-web --restart unless-stopped -p 127.0.0.1:8080:8080 infocus-website:latest
```

Open **http://localhost:8080**. This example is reachable only from the host computer. If port 8080 is already used, change the host side to `127.0.0.1:8081:8080`, then open `http://localhost:8081`.

Check the running container:

```text
docker ps
docker logs infocus-web
docker inspect --format="{{.State.Health.Status}}" infocus-web
```

The health status starts as `starting` and should become `healthy` after the first check. Test `/contact/`, `/services/`, and a made-up path that should show the 404 page.

### Step 4 — Host on a Linux server

Build the image on the server from the source project, or transfer a saved image as described below. To expose port 8080 on the server's network interfaces, create the container with:

```text
docker run -d --name infocus-web --restart unless-stopped -p 8080:8080 infocus-website:latest
```

Use this instead of the local-only command, not alongside it with the same container name. Open `http://SERVER_IP:8080` after allowing that port in the hosting provider's firewall. Docker publishes this port through its own networking rules; do not assume UFW alone restricts a published Docker port. See [Docker port publishing](https://docs.docker.com/engine/network/port-publishing/).

For your public domain with HTTPS, use a reverse proxy or load balancer with a trusted certificate. A reverse proxy running on the same host can forward to the local-only `127.0.0.1:8080` binding. The container itself serves HTTP; it does not issue a certificate. Keep your domain at the website root, not a URL subfolder.

### Step 5 — Stop, restart or update

Stop and start the existing container:

```text
docker stop infocus-web
docker start infocus-web
```

After changing code, images or `emails.json`, rebuild the image and recreate the container:

```text
docker build --pull -t infocus-website:latest .
docker stop infocus-web
docker rm infocus-web
docker run -d --name infocus-web --restart unless-stopped -p 127.0.0.1:8080:8080 infocus-website:latest
```

Use the same port binding as your original deployment when recreating it. These commands replace only the named `infocus-web` container. This static website stores no customer submissions inside the container. The Gmail draft flow stays the same: customers send the message themselves in Gmail. Recipient changes require an image rebuild; setting a runtime environment variable will not change the built recipient list.

### Optional — Transfer the image without a registry

On the computer where you built the image:

```text
docker save -o infocus-website.tar infocus-website:latest
```

Transfer `infocus-website.tar` to the other Docker host, then run there:

```text
docker load -i infocus-website.tar
```

Start the container using the appropriate command above. The image architecture must match the destination; an image built for an ARM computer is not automatically an x86 server image. To build for an x86-64 Linux server explicitly, use `docker build --platform linux/amd64 -t infocus-website:latest .` on a Docker installation that supports that target.

Docker is not installed in the current workspace environment, so the image has not been built or run here. The configuration was reviewed against this project's static export and the official image documentation. The first Docker build and container health check remain to be run on a Docker-enabled computer.
