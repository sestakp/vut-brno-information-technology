using System;
using FestivalAdministration.BL.Interfaces;
using FestivalAdministration.Common;

namespace FestivalAdministration.Messages
{
    public abstract class Message<T> : IMessage where T : IId
    {
        private Guid? _id;
        public T Model { get; set; }

        public Guid Id
        {
            get => _id ?? Model.Id;
            set => _id = value;
        }

        public Guid TargetId
        {
            get => throw new NotImplementedException();
            set => throw new NotImplementedException();
        }
    }
}