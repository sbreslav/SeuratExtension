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
    public class Clustering
    {
        // Figure out generator!! 
        Random seed = new Random();

        public double[][] tSNE2D;
        public double[][] tSNE3D;

        public int[] kMeansLabels2D;
        public int[] kMeansLabels3D;

        public double[][] kMeansPoints2D;
        public double[][] kMeansPoints3D;

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

        // testing data
        public Clustering()
        {
            tSNE2D = runTSNE(observations, 2);
            var kMeans2D = getKMeansData(tSNE2D, 3);
            kMeansLabels2D = kMeans2D.Item1;
            kMeansPoints2D = kMeans2D.Item2;

            tSNE3D = runTSNE(observations, 3);
            var kMeans3D = getKMeansData(tSNE3D, 3);
            kMeansLabels2D = kMeans3D.Item1;
            kMeansPoints3D = kMeans3D.Item2;
        }



        // This constructor calls tSNE dimnesionality reduction.
        // After that is clusters the reduced data into provided number of clusters. 
        public Clustering(double[][] refineryResults, bool runTSNE2D, bool runTSNE3D, int clusters)
        {
            tSNE2D = new double[refineryResults.Length][];
            tSNE3D = new double[refineryResults.Length][];

            kMeansLabels2D = new int[refineryResults.Length];
            kMeansLabels3D = new int[refineryResults.Length];

            kMeansPoints2D = new double[refineryResults.Length][];
            kMeansPoints3D = new double[refineryResults.Length][];

            if (runTSNE2D)
            {
                tSNE2D = runTSNE(refineryResults, 2);

                // K-MEANS
                var kMeans2D = getKMeansData(tSNE2D, clusters);
                kMeansLabels2D = kMeans2D.Item1;
                var rawkMeansPoints2D = kMeans2D.Item2;
                kMeansPoints2D = runTSNE(rawkMeansPoints2D, 2);
            }

            if (runTSNE3D)
            {
                tSNE3D = runTSNE(refineryResults, 3);
                var kMeans3D = getKMeansData(tSNE3D, clusters);
                kMeansLabels3D = kMeans3D.Item1;
                var rawkMeansPoints3d = kMeans3D.Item2;
                kMeansPoints3D = runTSNE(rawkMeansPoints3d, 3);
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

        // TSNE 
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

        Tuple<int[], double[][]> getKMeansData(double[][] observations, int numberOfClusters)
        {
            // Create a new K-Means algorithm
            KMeans kmeans = new KMeans(k: numberOfClusters);
            
            // Compute and retrieve the data centroids
            var clusters = kmeans.Learn(observations);

            // Get covariance to the list
            var covariance = kmeans.Clusters[0].Covariance;

            // Use the centroids to parition all the data
            int[] labels = clusters.Decide(observations);

            return Tuple.Create(labels, covariance);

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


    }
}
