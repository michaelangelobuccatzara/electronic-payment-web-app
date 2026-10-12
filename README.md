## Clone & Install

```bash
# Clone your repo (replace with your actual URL)
git clone https://github.com/michaelangelobuccatzara/reactjs-template.git

# Go into the project
cd reactjs-template

# Install dependencies
npm install
```

## Re-initialize Git (optional but recommended)

If you want a fresh git history for the new project instead of carrying over your template's commits:

```bash
rm -rf .git
git init
git add .
git commit -m "initial commit"
```

## Set Up Environment Variables

```bash
cp .env.example .env
```

Then fill in your actual values in `.env` (e.g. `VITE_API_BASE_URL`).

## Run It

```bash
npm run dev
```