using SkiaSharp;
using SkiaSharp.Views.Maui;
using MauiCanvasCore.Services;
using System.Diagnostics;

namespace MauiCanvasCore
{
    public partial class MainPage : ContentPage
    {
        private readonly ParticleService _particleService;
        private readonly System.Timers.Timer _timer;
        private (float x, float y) _canvasScalse = (0, 0);
        private (float x, float y, float r) _cursor = (0, 0, 10);
        private readonly SKPaint _whitePaint = new()
        {
            Color = SKColors.White,
            IsAntialias = false,
            Style = SKPaintStyle.Fill
        };
        private readonly SKPaint _redPaint = new()
        {
            Color = SKColors.Red,
            IsAntialias = true,
            Style = SKPaintStyle.Stroke,
            StrokeWidth = 2
        };

        public MainPage(ParticleService particleService)
        {
            InitializeComponent();
            _particleService = particleService;
            _timer = new(10);
            _timer.Elapsed += (sender, args) => InvalidateCanvas();
            _timer.Start();
        }

        private void OnPaintSurface(object sender, SKPaintSurfaceEventArgs args)
        {
            var canvas = args.Surface.Canvas;
            canvas.Clear(SKColors.Black);
            _canvasScalse = (args.Info.Width / 1200f, args.Info.Height / 600f);

            var cellWidth = _canvasScalse.x;
            var cellHeight = _canvasScalse.y;

            foreach (var p in _particleService.GetParticles)
            {
                canvas.DrawRect(cellWidth * p.X, cellHeight * p.Y, cellWidth, cellHeight, _whitePaint);
            }
            canvas.DrawCircle(cellWidth * _cursor.x, cellWidth * _cursor.y, _cursor.r, _redPaint);
        }

        private void OnTouch(object sender, SKTouchEventArgs args)
        {
            if (args.ActionType == SKTouchAction.Moved)
            {
                _cursor.x = args.Location.X / _canvasScalse.x;
                _cursor.y = args.Location.Y / _canvasScalse.y;
            }
            if (args.ActionType == SKTouchAction.WheelChanged)
            {
                _cursor.r += args.WheelDelta / 10;
                _cursor.r = Math.Min(Math.Max(2, _cursor.r), 100);
            }
            if (args.MouseButton == SKMouseButton.Left && (args.ActionType == SKTouchAction.Pressed || args.ActionType == SKTouchAction.Moved))
            {
                var particleX = (int)(args.Location.X / _canvasScalse.x);
                var particleY = (int)(args.Location.Y / _canvasScalse.y);
                _particleService.AddParticle(new Particle { X = particleX, Y = particleY });
            }
        }

        private void StartSimulation(object sender, EventArgs e)
        {
            _particleService.Start();
        }

        private void StopSimulation(object sender, EventArgs e)
        {
            _particleService.Stop();
        }

        private void InvalidateCanvas()
        {
            MainThread.BeginInvokeOnMainThread(() => CanvasView.InvalidateSurface());
        }
    }
}
