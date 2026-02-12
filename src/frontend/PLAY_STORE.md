# Publishing to Google Play Store

This document describes how to package and publish this 3D farming game to the Google Play Store using an Android WebView wrapper.

## Overview

Since this is a web-based game built with React and Three.js, you'll need to wrap it in a native Android application to publish on the Play Store. The wrapper will use Android's WebView component to display your game.

## Prerequisites

- Android Studio installed
- Google Play Developer account ($25 one-time fee)
- Built production version of your game (`npm run build` in the frontend directory)

## Step 1: Build Your Game

