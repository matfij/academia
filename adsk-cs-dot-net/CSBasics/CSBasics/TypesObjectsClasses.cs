using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSBasics

{
    public class Image
    {
        private string _filename;

        public static Image FromFile(string filename) => new Image(filename);

        public Image(string filename)
        {
            _filename = filename;
        }
    }

    public class Companion
    {

    }

    public interface IPhotoProvider
    {
        Image? GetPhoto();
    }

    internal class ModelPhotoProvider : IPhotoProvider
    {
        // automatically manages creation, caching value
        // is thread aware - one initialization for multiple threads
        private Lazy<Image?> _photo;

        private ModelPhotoProvider(string photoUri)
        {
            _photo = new Lazy<Image?>(() => File.Exists(photoUri) ? Image.FromFile(photoUri) : null);
        }

        public Image? GetPhoto() => _photo.Value;

        // nested classes have acces to container class private properties
        // do they break the single responsibility principle?
        public static class PhotoProviderFactory
        {
            public static IPhotoProvider Create(string photoUri)
            {
                return File.Exists(photoUri) ? new ModelPhotoProvider(photoUri) : DefaultPhotoProvider.Instance;
            }
        }
    }

    internal class DefaultPhotoProvider : IPhotoProvider
    {
        private Lazy<Image> _image;
        private static readonly string DEFAULT_URI = "canine.png";

        // singleton - the only place where the class will be instanciated
        public static DefaultPhotoProvider Instance { get; } = new();

        private DefaultPhotoProvider()
        {
            _image = new Lazy<Image>(() => Image.FromFile(DEFAULT_URI));
        }

        public Image GetPhoto() => _image.Value;
    }

    internal class ModelBase
    {
        public int Id { get; }
        public string Name { get; }
        public IPhotoProvider PhotoProvider { get; }

        public ModelBase(int id, string name, string photoUri)
        {
            Id = id;
            Name = name;
            PhotoProvider = ModelPhotoProvider.PhotoProviderFactory.Create(photoUri);
        }

        public override string ToString() => Name;
    }

    internal class CanineModel : ModelBase
    {
        public Companion Companion { get; }

        public CanineModel(int id, string name, string photoUri, Companion companion) : base(id, name, photoUri)
        {
            Companion = companion;
        }
    }

    internal class Program
    {
        void OnSelection(object sender)
        {
            // pattern matching - if
            if (sender is CanineModel)
            {
                Console.WriteLine("A Canine");
            }
            // pattern matching - switch
            switch (sender)
            {
                // casted variable scoped to a single case
                case CanineModel castedModel:
                    {
                        Console.WriteLine("A Canine", castedModel.Name);
                        break;
                    }

            }
        }
    }

    /*
     * Classes - support inheritance, interfaces, reference equality, fields validation (setters) | providing shared logic, 
     * 
     * Record Classes - supports value equality | storing & validating properties
     * 
     * Structures - better performance (creating instance), value equality, may use interfaces, no inheritance | for small types
     */
}
