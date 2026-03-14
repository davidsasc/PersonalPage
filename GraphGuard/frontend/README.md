# Run your project

## General

- Run `npm install` once to make sure all dependencies are installed.
- Run the project using `npm run dev` from the project root.
- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Material UI

Used as the main design library. Use the sx prop on the Mui components for styling. This can be done using shared styles across components or component specific styles.
Additionally the theme is provided by Material UI and light/dark mode is implemented by default.
To see the responsive behavior of Mui components take a look at the example page linked on the landing page.

## Redux

We implemented Redux as an optional state manager for Nxtstart. The store can be found `/store/*`.