﻿using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;

namespace SeuratExtension
{
    /// <summary>
    /// Interaction logic for SeuratExtensionWindow.xaml
    /// </summary>
    public partial class SeuratExtensionWindow : Window
    {
        private StudyInfo _study;
        private HallOfFame _hof;
        private HallOfFame _complete;

        public SeuratExtensionWindow()
        {
            InitializeComponent();

            // Hide the options pane until something is selected

            //TaskOptions.Visibility = Visibility.Hidden;
            //TaskOptions.Height = 0;
            _study = null;
            _hof = null;
        }

        private void OnDataGridSelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var viewModel = MainGrid.DataContext as SeuratExtensionWindowViewModel;
            if (e.AddedItems.Count > 0)
            {
                _study = e.AddedItems[0] as StudyInfo;

                // Display the options pane with automatic height

                TaskOptions.Visibility = Visibility.Visible;
                //TaskOptions.Height = double.NaN;
                //TaskOptions.Margin = new Thickness(10);
                
                if (_study != null && viewModel != null)
                {
                    _hof = viewModel.GetHallOfFame(_study);
                    _complete = viewModel.GetHallOfFame(_study); // Get it twice to avoid cloning
                    //_complete = viewModel.GetComplete(_study, _complete);
                    viewModel.InitProperties(_hof.solutions.Length, _complete.solutions.Length, viewModel.UseComplete);

                    //DisplayOrHideControls(true, true);
                }
            }
        }

        private void OnDataGridMouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (sender != null)
            {
                _study = null;
                //TaskOptions.Visibility = Visibility.Hidden;
                //TaskOptions.Height = 0;
                //TaskOptions.Margin = new Thickness(0);
                var grid = sender as DataGrid;
                if (grid != null && grid.SelectedItems != null && grid.SelectedItems.Count == 1)
                {
                    var dgr = grid.ItemContainerGenerator.ContainerFromItem(grid.SelectedItem) as DataGridRow;
                    if (dgr.IsMouseOver)
                    {
                        (dgr as DataGridRow).IsSelected = false;
                    }
                }
            }
        }

        private async void OnExecuteButtonClick(object sender, RoutedEventArgs e)
        {
            var viewModel = MainGrid.DataContext as SeuratExtensionWindowViewModel;
            if (_study != null && viewModel != null)
            {
                //ShowProgress(true);
                try
                {
                    await viewModel.RunTasks(_study, _hof, _complete);
                }
                catch (System.Exception ex)
                {
                    MessageBox.Show("Please check the log in the output folder.",
                                    "Error running task",
                                    MessageBoxButton.OK,
                                    MessageBoxImage.Error);
                    viewModel.LogException(ex);
                }
                //ShowProgress(false);
            }
        }

        private void OnCancelButtonClick(object sender, RoutedEventArgs e)
        {
            var viewModel = MainGrid.DataContext as SeuratExtensionWindowViewModel;
            if (viewModel != null)
            {
                viewModel.Escape = true;
                ShowProgress(false);
                viewModel.DisableExecute(true);
            }
        }

        private void OnAnimateChecked(object sender, RoutedEventArgs e)
        {
            var checkBox = sender as CheckBox;
            if (checkBox != null)
            {
                //var check = checkBox.IsChecked.Value;
                //DisplayOrHideControls(check);
            }
        }

        private void DisplayOrHideControls(bool check, bool forceHide = false)
        {
            //var val = check ? new GridLength(0, GridUnitType.Auto) : new GridLength(0);

            // Show/hide the load image checkbox, root filename and sort levels

            //TaskOptions.RowDefinitions[6].Height = val;
            //TaskOptions.RowDefinitions[7].Height = val;
            //TaskOptions.RowDefinitions[1].Height = val;
        }

        private void ShowProgress(bool showProgress)
        {
            var show = showProgress ? Visibility.Visible : Visibility.Hidden;
            var hide = showProgress ? Visibility.Hidden : Visibility.Visible;
            TaskOptions.Visibility = hide;
            StudyList.Visibility = hide;
            //ProgressGrid.Visibility = show;
            var viewModel = MainGrid.DataContext as SeuratExtensionWindowViewModel;
            if (viewModel != null)
            {
                viewModel.Progress = 0;
            }
        }

        private void OnSortComboSelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var combo = sender as ComboBox;
            if (combo != null)
            {
                var level = combo.DataContext as SortLevel;
                if (level != null)
                {
                    var viewModel = MainGrid.DataContext as SeuratExtensionWindowViewModel;
                    if (viewModel != null)
                    {
                        var levels = viewModel.GetSortLevels();

                        if (e.RemovedItems.Count == 0 || e.AddedItems.Count > 0)
                        {
                            // Check whether the item selected is an empty value

                            if (e.AddedItems.Count > 0 && e.AddedItems[0].ToString() == viewModel.EmptyComboValue)
                            {
                                // Clear the values

                                viewModel.RemoveSortLevels(level.Number + 1);
                            }
                            else if (level.Number == levels.Length - 1)
                            {
                                viewModel.AddSortLevel();
                            }
                            else
                            {
                                viewModel.UpdateSortLevels();
                            }
                        }
                    }
                }
            }
        }
    }
}
