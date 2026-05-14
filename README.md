# 🚀 LUMEN LITE - Deployment Ready

This is the "High Efficiency" version of Lumen. It is designed to be 100% free to run, extremely fast, and zero-maintenance.

## ✨ Features
- **Mega-Brain Analysis:** Uses a single AI call to handle Discovery, Strategy, ROI, and Slide content.
- **Instant PPTX:** Generates PowerPoint files directly in your browser (no server costs).
- **Modern UI:** Clean, dark mode interface focused on speed.
- **$0 Cost:** Designed to stay within the free tiers of Vercel and Gemini.

## 🛠️ How to Deploy (3 Steps)

### 1. Get your API Key
Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and get a free **Gemini API Key**.

### 2. Push to GitHub
1. Create a new repository on GitHub.
2. Run these commands in this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Lumen Lite"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### 3. Deploy to Vercel
1. Go to [Vercel](https://vercel.com) and click "Add New" -> "Project".
2. Select your GitHub repository.
3. **CRITICAL:** Under "Environment Variables", add:
   - Name: `GEMINI_API_KEY`
   - Value: `(Your API Key from step 1)`
4. Click **Deploy**.

---

## 💡 Why this is better
- **No Database:** No Supabase/Prisma setup required.
- **No Complex Auth:** Uses Vercel environment variables for security.
- **No "Trial and Error":** This code is pre-optimized for first-time developers.

Enjoy your efficient new tool! 🚀
