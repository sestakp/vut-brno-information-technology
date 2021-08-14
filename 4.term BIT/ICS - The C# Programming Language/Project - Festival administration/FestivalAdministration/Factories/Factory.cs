using System;
using FestivalAdministration.Interfaces;

namespace FestivalAdministration.Factories
{
    public class Factory<T> : IFactory<T>
    {
        private readonly Func<T> _ctorFunc;

        public Factory(Func<T> ctorFunc)
        {
            _ctorFunc = ctorFunc;
        }


        public T Create()
        {
            return _ctorFunc();
        }
    }
}