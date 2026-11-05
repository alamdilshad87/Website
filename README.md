# Md Dilshad Alam | Portfolio

A responsive, single-page portfolio website for Md Dilshad Alam, featuring a dark studio-inspired aesthetic, project showcase, design reel, journey timeline, searchable technology stack, and contact links.

This project is built as a static website using plain HTML, CSS, and JavaScript, with no build tooling required.

## Overview

This portfolio is designed to present:

- software engineering and backend/full-stack work
- AI and ML project experience
- design and visual branding work
- career journey and experience timeline
- skills and technology toolbox
- professional contact and social links

The visual style uses a futuristic editorial look with bold typography, deep navy/black surfaces, orange accent highlights, and modular grid-based layout sections.

## Project Structure

```text
WebPortfolio/
├── index.html
├── README.md
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── app.js
│   └── images/
│       ├── dilshad.jpg
│       ├── pro-nite.jpg
│       ├── posters-1.jpg
│       ├── posters-2.jpg
│       ├── stories.jpg
│       └── ...
└── (other files if added later)
```

## Files

### index.html
Contains the full page structure:

- navigation
- hero section
- project work section
- design gallery section
- journey timeline
- skill stack section
- contact section
- footer markup

### assets/css/styles.css
Includes all styling rules for:

- layout and spacing
- typography
- color palette and theming
- responsive behavior
- cards, buttons, nav, forms, gallery, and timeline styling
- animations and visual effects

### assets/js/app.js
Contains interactive behavior such as:

- theme toggle
- nav menu handling
- project filtering
- timeline rendering
- design reel navigation
- gallery lightbox behavior
- search/filter for skill tags
- typing animation and reveal effects

### assets/images
Stores all static media used by the portfolio, including:

- portrait photo
- poster assets
- event graphics
- social media designs
- merchandise visuals
- gallery images

## Features

- Responsive design for desktop and mobile screens
- Sticky navigation with active section highlighting
- Theme toggle (light/dark mode behavior)
- Animated hero highlight and typing text effect
- Filterable project cards
- Design chapter carousel and fullscreen modal preview
- Gantt-style experience timeline
- Searchable technology stack filter
- Contact actions with copy links and external URLs
- Fast static site performance

## Local Development

Because this is a static website, you can run it locally without any installation or package manager.

### Option 1: Python HTTP server

From the project folder, run:

```bash
cd C:\Users\bruh9\Downloads\WebPortfolio
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

### Option 2: Open directly

You can also open `index.html` directly in a browser, though some local viewing behavior is more consistent through a local server.

## Customization Guide

### Update personal information
Edit the text content directly in `index.html` for:

- name
- role/title
- summary and bio
- project descriptions
- certifications and links
- contact URLs
- social links

### Change colors or theme
Modify the CSS variables in `assets/css/styles.css` under the `:root` selector.

Example variables:

```css
:root {
  --bg: #07080E;
  --fg: #F2EFE9;
  --o: #FF7A3D;
  --p: #AAB6FF;
  --t: #2BE8B0;
}
```

### Replace images
Place your new image files in `assets/images/` and update the corresponding image paths in `index.html` or the data arrays in `assets/js/app.js`.

### Update project data
The portfolio content is stored in JavaScript arrays inside `assets/js/app.js`. To change:

- project names
- categories
- descriptions
- tech stacks
- design chapter information
- journey entries

edit the arrays and objects there.

## Deployment

This portfolio can be deployed to any static hosting service, including:

- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- Azure Static Web Apps
- any simple web server or CDN

Since it is a static site, deployment is very straightforward.

## Browser Compatibility

This project is designed for modern browsers and uses standard HTML5, CSS, and JavaScript features.

Recommended browsers:

- Chrome
- Edge
- Firefox
- Safari

## Notes

- External Google Fonts are used for typography.
- The site is intentionally designed as a single-page portfolio rather than a multi-page app.
- No backend or database is required.
- The project is easy to maintain and extend for future portfolio additions.

## License

This project is intended for personal portfolio use. If you plan to reuse or modify it for a different project, make sure you have permission for any images, branding, or content included.

## Author

Md Dilshad Alam

## Contact

- LinkedIn: https://www.linkedin.com/in/alamdilshad87
- GitHub: https://github.com/alamdilshad87
- Behance: https://www.behance.net/alamdilshad87

## Future Improvements

Possible next steps for the project:

- split JavaScript into modular files
- add a contact form backend integration
- add smooth transitions for more animation polish
- create a version tailored for recruiters or employers
- add a downloadable resume section
- migrate to a framework like React or Vite for scalability

## Quick Start Summary

```bash
cd C:\Users\bruh9\Downloads\WebPortfolio
python -m http.server 8000
```

Open `http://localhost:8000/` in your browser.
