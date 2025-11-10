# Portfolio Website Builder

A dynamic, full-stack portfolio website builder built with React and Firebase. Create, manage, and publish your professional portfolio in minutes with multiple customizable templates.

## 🚀 Features

- **Authentication**
  - Email/Password sign-up and sign-in
  - Google OAuth integration
  - Secure session management

- **Profile Management**
  - Personal information (name, bio, location, contact)
  - Profile photo upload
  - Social media links (GitHub, LinkedIn, Twitter, Website)
  - Skills management
  - SEO settings (meta title, description)

- **Project Portfolio**
  - Add, edit, and delete projects
  - Multiple image uploads per project
  - Project details (title, description, technologies)
  - Live demo and GitHub repository links

- **Template Selection**
  - **Modern Template**: Vibrant gradients with contemporary design
  - **Minimal Template**: Clean typography with elegant simplicity
  - **Creative Template**: Bold layouts with sidebar navigation

- **Live Preview**
  - Real-time portfolio preview
  - See changes before publishing
  - Responsive design preview

## 🛠️ Tech Stack

- **Frontend**: React (JSX), Vanilla CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Icons**: Lucide React
- **Hosting**: Firebase Hosting (recommended)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/portfolio-builder.git
cd portfolio-builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

#### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics (optional)

#### Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** provider
4. Add your authorized domains

#### Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Start in **production mode**
3. Choose your preferred location

#### Enable Firebase Storage

1. Go to **Storage** → **Get Started**
2. Start in **production mode**
3. Storage will be created

#### Get Firebase Configuration

1. Go to **Project Settings** → **General**
2. Scroll to "Your apps" section
3. Click the web icon (</>) to create a web app
4. Copy the Firebase configuration object

### 4. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 5. Deploy Firebase Rules

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore
# - Storage
# - Hosting

# Deploy security rules
firebase deploy --only firestore:rules,storage:rules
```

### 6. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
portfolio-builder/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── AuthForm.jsx
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── Profile/
│   │   │   └── ProfileEditor.jsx
│   │   ├── Projects/
│   │   │   ├── ProjectsList.jsx
│   │   │   └── ProjectForm.jsx
│   │   ├── Preview/
│   │   │   └── PortfolioPreview.jsx
│   │   ├── Templates/
│   │   │   ├── ModernTemplate.jsx
│   │   │   ├── MinimalTemplate.jsx
│   │   │   └── CreativeTemplate.jsx
│   │   ├── Layout/
│   │   │   └── Navbar.jsx
│   │   └── Common/
│   │       └── Loading.jsx
│   ├── services/
│   │   ├── firebase.js
│   │   ├── auth.service.js
│   │   ├── profile.service.js
│   │   ├── project.service.js
│   │   └── storage.service.js
│   ├── hooks/
│   │   ├── useProjects.js
│   │   └── useImageUpload.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── styles/
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   ├── navbar.css
│   │   ├── profile.css
│   │   ├── projects.css
│   │   ├── modal.css
│   │   └── templates.css
│   ├── utils/
│   │   ├── constants.js
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── config/
│   │   └── firebase.config.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── .env
├── .env.example
├── .gitignore
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── package.json
└── README.md
```

## 🚀 Deployment

### Deploy to Firebase Hosting

```bash
# Build the production app
npm run build

# Deploy to Firebase
firebase deploy

# Or use the npm script
npm run deploy
```

Your app will be live at: `https://your-project-id.web.app`

### Deploy to Other Platforms

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

#### Render
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables

## 🎨 Customization

### Adding New Templates

1. Create a new template component in `src/components/Templates/`
2. Import and add it to `src/utils/constants.js`
3. Update the template selector in `ProfileEditor.jsx`
4. Add template styles to `src/styles/templates.css`

### Modifying Styles

All styles are in the `src/styles/` directory. Each component has its own CSS file for easy customization.

## 📚 Learning Outcomes

- React component architecture and hooks
- Firebase Authentication (Email/Password, OAuth)
- Firestore database operations (CRUD)
- Firebase Storage for file uploads
- Context API for state management
- Custom hooks for reusable logic
- Form validation and error handling
- Responsive CSS design
- Security rules for Firebase

## 🔒 Security

- All Firebase security rules are configured for production use
- User data is protected with authentication checks
- File uploads are validated for size and type
- Public portfolios are read-only for non-owners

## 🐛 Troubleshooting

### Firebase Connection Issues

- Check if your Firebase credentials in `.env` are correct
- Verify that all Firebase services are enabled in the console
- Check browser console for specific error messages

### Image Upload Fails

- Verify Firebase Storage is enabled
- Check storage rules are deployed
- Ensure image size is under 5MB
- Verify image format (JPEG, PNG, GIF, WebP)

### Build Errors

```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm start
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

## 🎯 Future Enhancements

- [ ] Custom domain support
- [ ] Blog section
- [ ] Contact form with email integration
- [ ] Analytics dashboard
- [ ] Export portfolio as PDF
- [ ] More template options
- [ ] Dark mode support
- [ ] Multi-language support

---

**Built with ❤️ using React and Firebase**# Portfolio Website Builder

A dynamic, full-stack portfolio website builder built with React and Firebase. Create, manage, and publish your professional portfolio in minutes with multiple customizable templates.

## 🚀 Features

- **Authentication**
  - Email/Password sign-up and sign-in
  - Google OAuth integration
  - Secure session management

- **Profile Management**
  - Personal information (name, bio, location, contact)
  - Profile photo upload
  - Social media links (GitHub, LinkedIn, Twitter, Website)
  - Skills management
  - SEO settings (meta title, description)

- **Project Portfolio**
  - Add, edit, and delete projects
  - Multiple image uploads per project
  - Project details (title, description, technologies)
  - Live demo and GitHub repository links

- **Template Selection**
  - **Modern Template**: Vibrant gradients with contemporary design
  - **Minimal Template**: Clean typography with elegant simplicity
  - **Creative Template**: Bold layouts with sidebar navigation

- **Live Preview**
  - Real-time portfolio preview
  - See changes before publishing
  - Responsive design preview

## 🛠️ Tech Stack

- **Frontend**: React (JSX), Vanilla CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Icons**: Lucide React
- **Hosting**: Firebase Hosting (recommended)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/portfolio-builder.git
cd portfolio-builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

#### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics (optional)

#### Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** provider
4. Add your authorized domains

#### Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Start in **production mode**
3. Choose your preferred location

#### Enable Firebase Storage

1. Go to **Storage** → **Get Started**
2. Start in **production mode**
3. Storage will be created

#### Get Firebase Configuration

1. Go to **Project Settings** → **General**
2. Scroll to "Your apps" section
3. Click the web icon (</>) to create a web app
4. Copy the Firebase configuration object

### 4. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 5. Deploy Firebase Rules

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore
# - Storage
# - Hosting

# Deploy security rules
firebase deploy --only firestore:rules,storage:rules
```

### 6. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
portfolio-builder/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── AuthForm.jsx
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── Profile/
│   │   │   └── ProfileEditor.jsx
│   │   ├── Projects/
│   │   │   ├── ProjectsList.jsx
│   │   │   └── ProjectForm.jsx
│   │   ├── Preview/
│   │   │   └── PortfolioPreview.jsx
│   │   ├── Templates/
│   │   │   ├── ModernTemplate.jsx
│   │   │   ├── MinimalTemplate.jsx
│   │   │   └── CreativeTemplate.jsx
│   │   ├── Layout/
│   │   │   └── Navbar.jsx
│   │   └── Common/
│   │       └── Loading.jsx
│   ├── services/
│   │   ├── firebase.js
│   │   ├── auth.service.js
│   │   ├── profile.service.js
│   │   ├── project.service.js
│   │   └── storage.service.js
│   ├── hooks/
│   │   ├── useProjects.js
│   │   └── useImageUpload.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── styles/
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   ├── navbar.css
│   │   ├── profile.css
│   │   ├── projects.css
│   │   ├── modal.css
│   │   └── templates.css
│   ├── utils/
│   │   ├── constants.js
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── config/
│   │   └── firebase.config.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── .env
├── .env.example
├── .gitignore
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── package.json
└── README.md
```

## 🚀 Deployment

### Deploy to Firebase Hosting

```bash
# Build the production app
npm run build

# Deploy to Firebase
firebase deploy

# Or use the npm script
npm run deploy
```

Your app will be live at: `https://your-project-id.web.app`

### Deploy to Other Platforms

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

#### Render
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables

## 🎨 Customization

### Adding New Templates

1. Create a new template component in `src/components/Templates/`
2. Import and add it to `src/utils/constants.js`
3. Update the template selector in `ProfileEditor.jsx`
4. Add template styles to `src/styles/templates.css`

### Modifying Styles

All styles are in the `src/styles/` directory. Each component has its own CSS file for easy customization.

## 📚 Learning Outcomes

- React component architecture and hooks
- Firebase Authentication (Email/Password, OAuth)
- Firestore database operations (CRUD)
- Firebase Storage for file uploads
- Context API for state management
- Custom hooks for reusable logic
- Form validation and error handling
- Responsive CSS design
- Security rules for Firebase

## 🔒 Security

- All Firebase security rules are configured for production use
- User data is protected with authentication checks
- File uploads are validated for size and type
- Public portfolios are read-only for non-owners

## 🐛 Troubleshooting

### Firebase Connection Issues

- Check if your Firebase credentials in `.env` are correct
- Verify that all Firebase services are enabled in the console
- Check browser console for specific error messages

### Image Upload Fails

- Verify Firebase Storage is enabled
- Check storage rules are deployed
- Ensure image size is under 5MB
- Verify image format (JPEG, PNG, GIF, WebP)

### Build Errors

```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm start
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

## 🎯 Future Enhancements

- [ ] Custom domain support
- [ ] Blog section
- [ ] Contact form with email integration
- [ ] Analytics dashboard
- [ ] Export portfolio as PDF
- [ ] More template options
- [ ] Dark mode support
- [ ] Multi-language support

---

**Built with ❤️ using React and Firebase**# Portfolio Website Builder

A dynamic, full-stack portfolio website builder built with React and Firebase. Create, manage, and publish your professional portfolio in minutes with multiple customizable templates.

## 🚀 Features

- **Authentication**
  - Email/Password sign-up and sign-in
  - Google OAuth integration
  - Secure session management

- **Profile Management**
  - Personal information (name, bio, location, contact)
  - Profile photo upload
  - Social media links (GitHub, LinkedIn, Twitter, Website)
  - Skills management
  - SEO settings (meta title, description)

- **Project Portfolio**
  - Add, edit, and delete projects
  - Multiple image uploads per project
  - Project details (title, description, technologies)
  - Live demo and GitHub repository links

- **Template Selection**
  - **Modern Template**: Vibrant gradients with contemporary design
  - **Minimal Template**: Clean typography with elegant simplicity
  - **Creative Template**: Bold layouts with sidebar navigation

- **Live Preview**
  - Real-time portfolio preview
  - See changes before publishing
  - Responsive design preview

## 🛠️ Tech Stack

- **Frontend**: React (JSX), Vanilla CSS
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Icons**: Lucide React
- **Hosting**: Firebase Hosting (recommended)

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- Git

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/portfolio-builder.git
cd portfolio-builder
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Firebase Setup

#### Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Enable Google Analytics (optional)

#### Enable Authentication

1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. Enable **Google** provider
4. Add your authorized domains

#### Create Firestore Database

1. Go to **Firestore Database** → **Create database**
2. Start in **production mode**
3. Choose your preferred location

#### Enable Firebase Storage

1. Go to **Storage** → **Get Started**
2. Start in **production mode**
3. Storage will be created

#### Get Firebase Configuration

1. Go to **Project Settings** → **General**
2. Scroll to "Your apps" section
3. Click the web icon (</>) to create a web app
4. Copy the Firebase configuration object

### 4. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:

```env
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 5. Deploy Firebase Rules

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in your project
firebase init

# Select:
# - Firestore
# - Storage
# - Hosting

# Deploy security rules
firebase deploy --only firestore:rules,storage:rules
```

### 6. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
portfolio-builder/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── AuthForm.jsx
│   │   ├── Dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── Profile/
│   │   │   └── ProfileEditor.jsx
│   │   ├── Projects/
│   │   │   ├── ProjectsList.jsx
│   │   │   └── ProjectForm.jsx
│   │   ├── Preview/
│   │   │   └── PortfolioPreview.jsx
│   │   ├── Templates/
│   │   │   ├── ModernTemplate.jsx
│   │   │   ├── MinimalTemplate.jsx
│   │   │   └── CreativeTemplate.jsx
│   │   ├── Layout/
│   │   │   └── Navbar.jsx
│   │   └── Common/
│   │       └── Loading.jsx
│   ├── services/
│   │   ├── firebase.js
│   │   ├── auth.service.js
│   │   ├── profile.service.js
│   │   ├── project.service.js
│   │   └── storage.service.js
│   ├── hooks/
│   │   ├── useProjects.js
│   │   └── useImageUpload.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── styles/
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   ├── navbar.css
│   │   ├── profile.css
│   │   ├── projects.css
│   │   ├── modal.css
│   │   └── templates.css
│   ├── utils/
│   │   ├── constants.js
│   │   ├── validators.js
│   │   └── helpers.js
│   ├── config/
│   │   └── firebase.config.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── .env
├── .env.example
├── .gitignore
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── storage.rules
├── package.json
└── README.md
```

## 🚀 Deployment

### Deploy to Firebase Hosting

```bash
# Build the production app
npm run build

# Deploy to Firebase
firebase deploy

# Or use the npm script
npm run deploy
```

Your app will be live at: `https://your-project-id.web.app`

### Deploy to Other Platforms

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

#### Render
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables

## 🎨 Customization

### Adding New Templates

1. Create a new template component in `src/components/Templates/`
2. Import and add it to `src/utils/constants.js`
3. Update the template selector in `ProfileEditor.jsx`
4. Add template styles to `src/styles/templates.css`

### Modifying Styles

All styles are in the `src/styles/` directory. Each component has its own CSS file for easy customization.

## 📚 Learning Outcomes

- React component architecture and hooks
- Firebase Authentication (Email/Password, OAuth)
- Firestore database operations (CRUD)
- Firebase Storage for file uploads
- Context API for state management
- Custom hooks for reusable logic
- Form validation and error handling
- Responsive CSS design
- Security rules for Firebase

## 🔒 Security

- All Firebase security rules are configured for production use
- User data is protected with authentication checks
- File uploads are validated for size and type
- Public portfolios are read-only for non-owners

## 🐛 Troubleshooting

### Firebase Connection Issues

- Check if your Firebase credentials in `.env` are correct
- Verify that all Firebase services are enabled in the console
- Check browser console for specific error messages

### Image Upload Fails

- Verify Firebase Storage is enabled
- Check storage rules are deployed
- Ensure image size is under 5MB
- Verify image format (JPEG, PNG, GIF, WebP)

### Build Errors

```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
npm start
```

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

## 🎯 Future Enhancements

- [ ] Custom domain support
- [ ] Blog section
- [ ] Contact form with email integration
- [ ] Analytics dashboard
- [ ] Export portfolio as PDF
- [ ] More template options
- [ ] Dark mode support
- [ ] Multi-language support

---

**Built with ❤️ using React and Firebase**