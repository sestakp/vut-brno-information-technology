using System;
using System.Globalization;
using System.Windows.Data;
using System.Windows.Media;

namespace FestivalAdministration.Convertors
{
    internal class ImageConverter : IValueConverter
    {
        private Uri DefaultValue { get; } = new Uri(@"../../Resources/Images/image.png", UriKind.Relative);

        public object Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return value ?? DefaultValue;
        }


        public object ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return (Uri) value == DefaultValue ? null : value;
        }
    }
}