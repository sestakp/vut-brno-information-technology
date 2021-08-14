using System.ComponentModel;
using System.Runtime.CompilerServices;
using FestivalAdministration.Annotations;
using FestivalAdministration.Interfaces;

namespace FestivalAdministration.ViewModels
{
    public class ViewModelBase : INotifyPropertyChanged, IViewModel
    {
        public event PropertyChangedEventHandler PropertyChanged;

        public virtual void Load()
        {
        }

        [NotifyPropertyChangedInvocator]
        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}