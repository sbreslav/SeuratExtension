using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Accord.MachineLearning;
using Accord.MachineLearning.Clustering;
using Accord.Math;
using Accord.Math.Distances;
using Accord.Statistics;


namespace SeuratExtension.src
{
    // Testing the Principal Component Analysis
    // Based on tutorial: https://arxiv.org/ftp/arxiv/papers/1210/1210.7463.pdf



    public class Clustering
    {
        // Figure out generator!! 
        Random seed = new Random();

        public double[][] tSNE2D;
        public double[][] tSNE3D;

        public int[] kMeansLabels2D;
        public int[] kMeansLabels3D;

        // Declare some observations
        double[][] observations =
        {
            new double[] { -5, -2, -1, 5 },
            new double[] { -5, -5, -6, 4 },
            new double[] {  2,  1,  1, 2 },
            new double[] {  1,  1,  2, 1 },
            new double[] {  1,  2,  2, 4 },
            new double[] {  3,  1,  2, 2 },
            new double[] { 11,  5,  4, 5 },
            new double[] { 15,  5,  6, 4 },
            new double[] { 10,  5,  6, 9 },
        };

        double[] weights = { 1, 0.1, 0.5, 0.3 };


        // This constructor calls tSNE dimnesionality reduction.
        // After that is clusters the reduced data into provided number of clusters. 
        public Clustering(double[][] refineryResults, bool runTSNE2D, bool runTSNE3D, int clusters)
        {
            tSNE2D = new double[refineryResults.Length][];
            tSNE3D = new double[refineryResults.Length][];

            kMeansLabels2D = new int[refineryResults.Length];
            kMeansLabels3D = new int[refineryResults.Length];

            if (runTSNE2D)
            {
                tSNE2D = runTSNE(refineryResults, 2);
                kMeansLabels2D = getLabelsForKMeans(tSNE2D, clusters);
            }

            if (runTSNE3D)
            {
                tSNE3D = runTSNE(refineryResults, 3);
                kMeansLabels3D = getLabelsForKMeans(tSNE3D, clusters);
            }

        }

        // This constructor calls tSNE dimnesionality reduction.
        // After that is clusters the reduced data into provided number of clusters. 
        // The clusters are calculated based on provided weights. 
        public Clustering(double[][] refineryResults, bool runTSNE2D, bool runTSNE3D, int clusters, double[] weights)
        {
            if (refineryResults[0].Length != weights.Length)
            {
                throw new System.ArgumentException("Number of weights is not equal to number of parameters");
            }

            tSNE2D = new double[refineryResults.Length][];
            tSNE3D = new double[refineryResults.Length][];

            kMeansLabels2D = new int[refineryResults.Length];
            kMeansLabels3D = new int[refineryResults.Length];

            // run 2d or 3d only if selected
            if (runTSNE2D)
            {
                tSNE2D = runTSNE(refineryResults, 2);
                kMeansLabels2D = getLabelsForKMeansWithLabels(refineryResults, clusters, weights);
            }

            if (runTSNE3D)
            {
                tSNE3D = runTSNE(refineryResults, 3);
                kMeansLabels3D = getLabelsForKMeansWithLabels(refineryResults, clusters, weights);
            }

        }

        // Simpliest implementation of tsne for the 2d double array
        double[][] runTSNE(double[][] observations, int outputDimension)
        {
            // Create a new t-SNE algorithm 
            TSNE tSNE = new TSNE()
            {
                NumberOfOutputs = outputDimension,
                Perplexity = 1.5
            };

            // Transform to a reduced dimensionality space
            double[][] output = tSNE.Transform(observations);

            // Make it 1-dimensional : probably not needed in our case
            //double[] y = output.Reshape();

            return output;
        }

        int[] getLabelsForKMeans(double[][] observations, int numberOfClusters)
        {
            // Create a new K-Means algorithm
            KMeans kmeans = new KMeans(k: numberOfClusters);

            // Compute and retrieve the data centroids
            var clusters = kmeans.Learn(observations);

            // Use the centroids to parition all the data
            int[] labels = clusters.Decide(observations);

            return labels;

        }

        int[] getLabelsForKMeansWithLabels(double[][] observations, int numberOfClusters, double[] weights)
        {

            // Create a new K-Means algorithm
            KMeans kmeans = new KMeans(k: numberOfClusters)
            {
                // For example, let's say we would like to consider the importance of 
                // the first column as 0.1, the second column as 0.7 and the third 0.9
                Distance = new WeightedSquareEuclidean(weights)
            };

            // Compute and retrieve the data centroids
            var clusters = kmeans.Learn(observations);

            // Use the centroids to parition all the data
            int[] labels = clusters.Decide(observations);

            return labels;
        }


        // Standard deviation
        void CalculateStandardDeviation(double[] x1, double[] x2)
        {
            // Compute means
            double mean1 = x1.Mean();
            double mean2 = x2.Mean();

            // Compute the standard deviations
            double standardDev1 = x1.StandardDeviation(mean1);
            double standardDev2 = x2.StandardDeviation(mean2);
        }

        // Covariance: measure of relationship between two variables
        double CovarianceForTwoLists(double[] x1, double[] x2)
        {
            double cov = x1.Covariance(x1);
            return cov;
        }

        double[,] CovarianceForMatrix(double[,] x)
        {
            double[,] covarianceMatrix = x.Covariance();
            return covarianceMatrix;
        }
    }
}
