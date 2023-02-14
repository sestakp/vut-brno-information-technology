using System.Windows;
using FestivalAdministration.ViewModels;

namespace FestivalAdministration.Views
{
    /// <summary>
    ///     Interaction logic for MainWindow_backp.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow(MainViewModel mainViewModel)
        { 
            InitializeComponent();
            DataContext = mainViewModel;
        }

        private void Button_Click(object sender, RoutedEventArgs e)
        {
        }
    }
}