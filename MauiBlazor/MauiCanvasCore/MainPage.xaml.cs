using SkiaSharp;
using SkiaSharp.Views.Maui;
using System.Collections.Generic;
using System.Timers;

namespace MauiCanvasCore
{
    public partial class MainPage : ContentPage
    {
        private readonly List<Particle> _particles = [];
        private readonly System.Timers.Timer _timer;

        public MainPage()
        {
            InitializeComponent();
            _timer = new(50);
            _timer.Elapsed += (s, e) => InvalidateCanvas();

            _particles.Add(new Particle { X = 10, Y = 10 });
            _particles.Add(new Particle { X = 50, Y = 30 });
            _particles.Add(new Particle { X = 100, Y = 80 });
            _particles.Add(new Particle { X = 150, Y = 120 });
        }

        private void OnPaintSurface(object sender, SKPaintSurfaceEventArgs args)
        {
            var canvas = args.Surface.Canvas;
            canvas.Clear(SKColors.Black);

            using var paint = new SKPaint { Color = SKColors.White, IsAntialias = true };

            foreach (var p in _particles)
            {
                canvas.DrawCircle(p.X, p.Y, 5, paint);
            }
        }

        private void StartSimulation(object sender, EventArgs e)
        {
            _timer.Start();
        }

        private void StopSimulation(object sender, EventArgs e)
        {
            _timer.Stop();
        }

        private void InvalidateCanvas()
        {
            MainThread.BeginInvokeOnMainThread(() => CanvasView.InvalidateSurface());
        }
    }

    public struct Particle
    {
        public float X { get; set; }
        public float Y { get; set; }
    }
}
