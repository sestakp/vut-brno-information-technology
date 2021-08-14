using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Media;
using FestivalAdministration.Controls.Models;

namespace FestivalAdministration.Convertors
{

    public class DataGridCellConverter : IMultiValueConverter
    {
        public object Convert(object[] values, Type targetType, object parameter, CultureInfo culture)
        {
            var dataGridCell = values[0] as DataGridCell;


            var columnName = dataGridCell.Column.Header.ToString();
            if (int.TryParse(columnName, out int index))
            {
                if(dataGridCell.DataContext is ProgramDataGridModel prog)
                {
                    if (!string.IsNullOrEmpty(prog.cells[index]))
                    {
                        if (prog.cells[index] == "^^")
                        {
                            prog.cells[index] = "";
                        }

                        dataGridCell.Foreground = new SolidColorBrush(Color.FromArgb(255, 255, 255, 255));
                        dataGridCell.BorderThickness = new Thickness(1, 1, 2, 2);
                        return new SolidColorBrush(Color.FromArgb(250, 255, 15, 15));
                    }
                }
            }
            else
            {
                dataGridCell.Foreground = new SolidColorBrush(Color.FromArgb(255, 255, 255, 255));
                dataGridCell.BorderBrush = new SolidColorBrush(Color.FromArgb(255, 10, 10, 10));
                return new SolidColorBrush(Color.FromArgb(255, 40, 40, 40));
            }

            // Snipped - all logic. Just return a Brush.
            return Brushes.White;
        }
        
        public object[] ConvertBack(object value, Type []targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException();
        }
        
    }
}
