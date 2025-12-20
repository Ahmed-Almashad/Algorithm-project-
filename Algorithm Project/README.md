# Sorting Algorithm Visualizer & Learning Game

An interactive web-based application for visualizing and learning sorting algorithms through hands-on gameplay. Designed for university-level Data Structures & Algorithms courses.

![Algorithm Selection](https://img.shields.io/badge/Algorithms-5-blue)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🎮 Features

### Algorithms Implemented
- **Bubble Sort** - O(n²) average, O(n) best case
- **Selection Sort** - O(n²) all cases
- **Insertion Sort** - O(n²) average, O(n) best case
- **Merge Sort** - O(n log n) all cases
- **Quick Sort** - O(n log n) average, O(n²) worst case
- **Heap Sort** – O(n log n) all cases
- 

### Game Features
- 📊 **Step-by-step visualization** with animated bars
- 🎯 **Game mode** - manually perform swaps following algorithm rules
- 📈 **Scoring system** - rewards, penalties, streak bonuses
- 🎚️ **Difficulty levels** - Easy (5), Medium (8), Hard (12), Expert (16)
- 📝 **Algorithm explanations** with pseudocode
- 👁️ **Demo mode** - watch algorithms in action
- 🏆 **Achievements** - unlock badges for accomplishments

### Color Coding
| State | Color | Description |
|-------|-------|-------------|
| Normal | Indigo | Default state |
| Comparing | Amber | Being compared |
| Swapping | Red | Being swapped |
| Sorted | Green | Final position |
| Selected | Purple | User selected |
| Pivot | Pink | Quick sort pivot |

## 🚀 Getting Started

### Run Locally
Simply open `index.html` in your web browser:

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/sorting-visualizer.git

# Open in browser
start index.html  # Windows
open index.html   # macOS
xdg-open index.html  # Linux
```

### Or use a local server
```bash
npx http-server . -p 8080
```

## 📁 Project Structure

```
sorting-visualizer/
├── index.html              # Main entry point
├── css/
│   └── main.css            # Styles & design system
├── js/
│   ├── app.js              # Main application controller
│   ├── algorithms/
│   │   ├── base.js         # Base algorithm class
│   │   ├── bubbleSort.js
│   │   ├── selectionSort.js
│   │   ├── insertionSort.js
│   │   ├── mergeSort.js
│   │   └── quickSort.js
│   ├── game/
│   │   ├── gameManager.js  # Game state & logic
│   │   └── scoring.js      # Score calculations
│   ├── visualization/
│   │   ├── renderer.js     # Bar rendering
│   │   └── animator.js     # Animation controller
│   └── utils/
│       ├── storage.js      # Local storage helpers
│       └── helpers.js      # Utility functions
└── README.md
```

## 🎓 Educational Use

This project is designed for:
- Computer Science students learning sorting algorithms
- Teaching assistants demonstrating algorithm concepts
- Self-study and exam preparation
- Understanding time/space complexity through visualization

## 🛠️ Technical Details

- **No frameworks** - Pure HTML, CSS, and JavaScript
- **No build step** - Open and run directly
- **Mobile responsive** - Works on all screen sizes
- **Local storage** - Saves progress and achievements
- **Modular architecture** - Clean separation of concerns

## 📝 License

MIT License - Feel free to use for educational purposes.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Add new sorting algorithms
- Improve visualizations
- Add new game modes
- Fix bugs or improve performance

