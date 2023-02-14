using System;
using FestivalAdministration.BL.Interfaces;
using FestivalAdministration.Common;

namespace FestivalAdministration.BL.Messages
{
    public abstract class Message<T> : IMessage
        where T : IId
    {
        private Guid? _id;
        public T Model;
        public Guid TargetId { get; set; }

        public Guid Id
        {
            get => _id ?? Model.Id;
            set => _id = value;
        }
    }
}