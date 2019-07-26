# SeuratExtenstion
 
This project is a Dynamo Extension that extends the visualization capabilities of Refinery for result-evaluation purposes.

## Overview

*Seurat* takes a specific Refinery run results values, a set of points in a high-dimensional space, and finds a faithful representation of those points in a lower-dimensional space in 3 axis. This is achieved by first dimensionality reduction and then clustering. There's no output (dimensions) limit, how cool is that? 

## Getting started

*Note: Bear in mind this is a work in progress developed during Autodesk Generative Design Hackathon by "Last Minute" team: Simon Breslav, Justyna Szychowska and Mercedes Carriquiry*

### Prerequisites

- [Dynamo](http://dynamobim.org/)
- [Refinery](https://www.autodesk.com/solutions/refinery-beta)

### Usage

You will need a Dynamo graph and some Refinery runs results. Go to View > Seurat Extension. Then choose your run, type the number of clusters and Run Analysis.


### License 

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.