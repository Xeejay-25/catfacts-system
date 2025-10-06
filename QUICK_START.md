# 🚀 Quick Start Guide - CatFacts System

## Getting Started in 3 Steps

### Step 1: Open Terminal
Open PowerShell or Command Prompt

### Step 2: Navigate & Start
```powershell
cd d:\CatFacts_System\catfacts-system\frontend
npm run dev
```

### Step 3: Open Browser
Visit: **http://localhost:5173**

---

## 🎮 How to Use the Application

### First Time Setup

1. **Welcome Page** (`/`)
   - Click "Get Started" or "Create Account"

2. **Create Account** (`/user/create`)
   - Enter a username (3-20 characters)
   - See your avatar preview
   - Click "Create Account"

3. **Dashboard** (`/dashboard`)
   - Automatically logged in
   - View your profile and stats

### Playing a Game

1. **Navigate to Play** (click "Play" in header or "Play Game" button)
   
2. **Choose Difficulty**
   - **Easy**: 10 questions, 30 sec each
   - **Medium**: 15 questions, 25 sec each
   - **Hard**: 20 questions, 20 sec each

3. **Answer Questions**
   - Read each question
   - Select an answer
   - Click "Submit Answer"
   - Learn a cat fact!
   - Click "Next Question"

4. **View Results**
   - See your score
   - Performance feedback
   - Options to play again or view history

### Navigation

- **Header Menu**:
  - Home → Welcome page
  - Play → Choose difficulty
  - Leaderboards → View rankings
  - History → Your past games (when logged in)
  - Dashboard → Your profile (when logged in)

- **User Actions**:
  - Click avatar → Go to dashboard
  - Logout → Return to welcome page
  - Login/Sign Up → User authentication

### Other Features

**View Leaderboards** (`/leaderboards`)
- See top players
- View stats (games, scores, averages)

**Check History** (`/history`)
- See all your past games
- View performance statistics
- Track your progress

**Dashboard** (`/dashboard`)
- View profile
- See stats summary
- Recent games
- Quick actions

---

## 🛠️ Development Commands

### Start Development Server
```powershell
npm run dev
```
Opens at: http://localhost:5173

### Build for Production
```powershell
npm run build
```
Creates optimized build in `dist/` folder

### Preview Production Build
```powershell
npm run preview
```

### Install Dependencies (if needed)
```powershell
npm install
```

---

## 📂 Project Location
```
D:\CatFacts_System\catfacts-system\frontend\
```

---

## 🐛 Troubleshooting

### Port Already in Use?
```powershell
# Kill the process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- --port 3000
```

### Dependencies Not Found?
```powershell
cd d:\CatFacts_System\catfacts-system\frontend
rm -rf node_modules
rm package-lock.json
npm install
```

### Browser Not Auto-Opening?
Manually open: http://localhost:5173

---

## 💡 Tips

1. **Create Multiple Users**: Test the app by creating multiple user accounts
2. **Try All Difficulties**: Each has different number of questions
3. **Check Leaderboards**: See how rankings work
4. **Mobile View**: Resize browser to see responsive design
5. **Logout & Login**: Test user switching functionality

---

## 📱 Test Routes

Direct URLs you can visit:

- http://localhost:5173/ - Welcome page
- http://localhost:5173/user/create - Create account
- http://localhost:5173/user/select - Select user
- http://localhost:5173/play - Choose difficulty
- http://localhost:5173/game?difficulty=easy - Start easy game
- http://localhost:5173/leaderboards - View rankings
- http://localhost:5173/history - Game history (requires login)
- http://localhost:5173/dashboard - User dashboard (requires login)

---

## 🎯 What to Test

### ✅ User Flow
1. Create account
2. View dashboard
3. Start game
4. Answer questions
5. View results
6. Check history
7. View leaderboards
8. Logout
9. Login with different user

### ✅ Responsive Design
- Desktop (> 968px)
- Tablet (768px - 968px)
- Mobile (< 768px)

### ✅ Navigation
- All header links work
- Footer links work
- Breadcrumb navigation
- Back button functionality

---

## 🔥 Cool Features to Try

1. **Avatar Generation**: Watch your avatar appear as you type username
2. **Animations**: Hover over buttons and cards for smooth effects
3. **Color-Coded Scores**: See different colors based on performance
4. **Cat Facts**: Learn something new with every question!
5. **Progress Bar**: Watch it fill as you answer questions
6. **Empty States**: Try visiting pages with no data

---

## 📚 Learning Resources

- **React Docs**: https://react.dev
- **React Router**: https://reactrouter.com
- **TypeScript**: https://www.typescriptlang.org
- **Vite**: https://vite.dev

---

## 🚀 Next Steps (Future Development)

1. Add Express.js backend
2. Connect to real CatFacts API
3. Add database for persistence
4. Implement authentication
5. Add timer for questions
6. Multiplayer mode
7. Achievements system
8. Social sharing

---

**Have fun playing and learning about cats! 🐱**
