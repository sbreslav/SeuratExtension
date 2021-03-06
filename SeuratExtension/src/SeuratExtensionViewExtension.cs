﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using Dynamo.ViewModels;
using Dynamo.Wpf.Extensions;
using SeuratExtension.src;

namespace SeuratExtension
{
    /// <summary>
    /// The View Extension framework for Dynamo allows you to extend
    /// the Dynamo UI by registering custom MenuItems. A ViewExtension has 
    /// two components, an assembly containing a class that implements 
    /// IViewExtension, and an ViewExtensionDefintion xml file used to 
    /// instruct Dynamo where to find the class containing the
    /// IViewExtension implementation. The ViewExtensionDefinition xml file must
    /// be located in your [dynamo]\viewExtensions folder.
    /// 
    /// This sample demonstrates an IViewExtension implementation which 
    /// shows a modeless window when its MenuItem is clicked. 
    /// The Window created tracks the number of nodes in the current workspace, 
    /// by handling the workspace's NodeAdded and NodeRemoved events.
    /// </summary>
    public class SeuratExtensionViewExtension : IViewExtension
    {
        private MenuItem sampleMenuItem;

        public void Dispose()
        {
        }

        public void Startup(ViewStartupParams p)
        {
        }

        public void Loaded(ViewLoadedParams p)
        {
            Clustering a = new Clustering();

            // Save a reference to your loaded parameters.
            // You'll need these later when you want to use
            // the supplied workspaces

            sampleMenuItem = new MenuItem { Header = "Seurat Extension" };
            sampleMenuItem.Click += (sender, args) =>
            {
                var dynViewModel = p.DynamoWindow.DataContext as DynamoViewModel;
                var viewModel = new SeuratExtensionWindowViewModel(p, dynViewModel);
                var window = new SeuratExtensionWindow
                {
                    // Set the data context for the main grid in the window.
                    MainGrid = { DataContext = viewModel },

                    // Set the owner of the window to the Dynamo window.
                    Owner = p.DynamoWindow
                };

                window.Left = window.Owner.Left + 400;
                window.Top = window.Owner.Top + 200;

                // Show a modeless window.
                window.Show();
            };
            p.AddMenuItem(MenuBarType.View, sampleMenuItem);
        }

        public void Shutdown()
        {
        }

        public string UniqueId
        {
            get
            {
                return Guid.NewGuid().ToString();
            }
        }

        public string Name
        {
            get
            {
                return "SeuratExtension View Extension";
            }
        }

    }
}