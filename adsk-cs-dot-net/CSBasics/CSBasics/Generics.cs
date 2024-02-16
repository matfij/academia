using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CSBasics
{
    // allow for sharing logic for different types in a strongly typed manner
    public class TreeNode<T> where T : notnull, IComparable<T>
    {
        public T Value { get; init; }
        private List<TreeNode<T>> _children = new();
        public TreeNode(T value) => Value = value;

        // append child in right order
        public TreeNode<T> AddChild(T newChild)
        {
            int index = _children.FindIndex(x => x.Value.CompareTo(newChild) > 0);
            var result = new TreeNode<T>(newChild);
            if (index < 0)
                _children.Add(result);
            else
                _children.Insert(index, result);
            return result;
        }

        public IEnumerable<(int Depth, T Value)> EnumerateSelfAndDescendantsWithDepth(int startDepth = 0)
        {
            yield return (startDepth, this.Value);
            ++startDepth;
            foreach (var child in _children)
            {
                foreach (var subChild in child.EnumerateSelfAndDescendantsWithDepth(startDepth))
                {
                    yield return subChild;
                }
            }
        }

        public IEnumerable<T> EnumerateSelfAndDescendants()
        {
            yield return this.Value;
            foreach (var child in _children)
            {
                foreach (var child2 in child.EnumerateSelfAndDescendants())
                    yield return child2;
            }
        }
    }

    public enum LocationType
    {
        Town,
        Country,
        World
    }

    public record class Location(string Name, LocationType Type) : IComparable<Location>
    {
        public static Location Earth => new Location("Earth", LocationType.World);

        public static Location MakeTown(string name) => new Location(name, LocationType.Town);

        public static Location MakeCountry(string name) => new Location(name, LocationType.Country);

        // IComperable requires to self-implement comparison method of objects
        public int CompareTo(Location? other) => Name.CompareTo(other?.Name);
    }

    public class GenericsProgram
    {
        void Main()
        {
            Location poland = Location.MakeCountry("Poland");
            Location england = Location.MakeCountry("England");
            Location wwa = Location.MakeTown("WWA");
            Location cracow = Location.MakeTown("Cracow");
            Location london = Location.MakeTown("London");
            Location oxford = Location.MakeTown("Oxford");

            TreeNode<Location> earthNode = new(Location.Earth);
            var polandNode = earthNode.AddChild(poland);
            var englandNode = earthNode.AddChild(england);
            polandNode.AddChild(wwa);
            polandNode.AddChild(cracow);
            englandNode.AddChild(london);
            englandNode.AddChild(oxford);

            foreach (var node in earthNode.EnumerateSelfAndDescendantsWithDepth())
            {
                Console.WriteLine($"{string.Empty.PadLeft(node.Depth, ' ')}{node.Value.Type}: {node.Value.Name}");
            }
        }
    }

    // generic base type for property sharing
    public class Product<T> where T : notnull
    {
        public List<T> RelatedItems { get; init; } = new();
    }

    public class Course : Product<Course>
    {
        public string Title { get; init; }
        public string Author { get; init; }

        public Course(string author, string title)
        {
            this.Author = author;
            this.Title = title;
        }
    }

    public class Library : Product<Library>
    {
        public string Name { get; init; }

        public Library(string name)
        {
            this.Name = name;
        }
    }
}
