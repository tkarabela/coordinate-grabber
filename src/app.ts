interface Rectangle {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
}

interface RectCoordinates {
    x: number;
    y: number;
    width: number;
    height: number;
}

class CoordinateGrabbber {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private image: HTMLImageElement | null = null;
    private originalImageWidth: number = 0;
    private originalImageHeight: number = 0;
    private isDrawing: boolean = false;
    private startX: number = 0;
    private startY: number = 0;
    private currentRect: RectCoordinates | null = null;
    private rectangles: Rectangle[] = [];
    private nextRectId: number = 1;
    private dropZone: HTMLElement;
    private fileInput: HTMLInputElement;
    private canvasContainer: HTMLElement;
    private controls: HTMLElement;
    private rectanglesList: HTMLElement;
    private copyButton: HTMLButtonElement;
    private clearAllButton: HTMLButtonElement;
    private resetButton: HTMLButtonElement;

    constructor() {
        this.canvas = document.getElementById('imageCanvas') as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d')!;
        this.dropZone = document.getElementById('dropZone')!;
        this.fileInput = document.getElementById('fileInput') as HTMLInputElement;
        this.canvasContainer = document.getElementById('canvasContainer')!;
        this.controls = document.getElementById('controls')!;
        this.rectanglesList = document.getElementById('rectanglesList')!;
        this.copyButton = document.getElementById('copyButton') as HTMLButtonElement;
        this.clearAllButton = document.getElementById('clearAllButton') as HTMLButtonElement;
        this.resetButton = document.getElementById('resetButton') as HTMLButtonElement;

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        // Drag and drop
        this.dropZone.addEventListener('click', () => this.fileInput.click());
        this.dropZone.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.dropZone.addEventListener('dragleave', () => this.handleDragLeave());
        this.dropZone.addEventListener('drop', (e) => this.handleDrop(e));
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Canvas drawing
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', () => this.handleMouseUp());
        this.canvas.addEventListener('mouseleave', () => this.handleMouseUp());

        // Buttons
        this.copyButton.addEventListener('click', () => this.copyAllCoordinates());
        this.clearAllButton.addEventListener('click', () => this.clearAllRectangles());
        this.resetButton.addEventListener('click', () => this.resetImage());
    }

    private handleDragOver(e: DragEvent): void {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.add('dragover');
    }

    private handleDragLeave(): void {
        this.dropZone.classList.remove('dragover');
    }

    private handleDrop(e: DragEvent): void {
        e.preventDefault();
        e.stopPropagation();
        this.dropZone.classList.remove('dragover');

        const files = e.dataTransfer?.files;
        if (files && files.length > 0) {
            this.loadImage(files[0]);
        }
    }

    private handleFileSelect(e: Event): void {
        const target = e.target as HTMLInputElement;
        const files = target.files;
        if (files && files.length > 0) {
            this.loadImage(files[0]);
        }
    }

    private loadImage(file: File): void {
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                this.image = img;
                this.setupCanvas();
                this.dropZone.classList.add('hidden');
                this.canvasContainer.classList.remove('hidden');
                this.controls.classList.remove('hidden');
            };
            img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
    }

    private setupCanvas(): void {
        if (!this.image) return;

        // Store original image dimensions
        this.originalImageWidth = this.image.width;
        this.originalImageHeight = this.image.height;

        // Calculate canvas size to fit image while maintaining aspect ratio
        const maxWidth = 1000;
        const maxHeight = 600;
        let width = this.image.width;
        let height = this.image.height;

        if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
        }
        if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
        }

        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.drawImage(this.image, 0, 0, width, height);
    }

    private getCanvasCoordinates(e: MouseEvent): { x: number; y: number } {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    private handleMouseDown(e: MouseEvent): void {
        if (!this.image) return;
        const coords = this.getCanvasCoordinates(e);
        this.isDrawing = true;
        this.startX = coords.x;
        this.startY = coords.y;
        this.currentRect = null;
    }

    private handleMouseMove(e: MouseEvent): void {
        if (!this.isDrawing || !this.image) return;
        const coords = this.getCanvasCoordinates(e);

        const width = coords.x - this.startX;
        const height = coords.y - this.startY;

        this.currentRect = {
            x: Math.min(this.startX, coords.x),
            y: Math.min(this.startY, coords.y),
            width: Math.abs(width),
            height: Math.abs(height)
        };

        this.draw();
    }

    private handleMouseUp(): void {
        if (this.isDrawing) {
            this.isDrawing = false;
            if (this.currentRect && this.currentRect.width > 0 && this.currentRect.height > 0) {
                // Save the rectangle to the list
                const savedRect: Rectangle = {
                    id: this.nextRectId++,
                    x: this.currentRect.x,
                    y: this.currentRect.y,
                    width: this.currentRect.width,
                    height: this.currentRect.height
                };
                this.rectangles.push(savedRect);
                this.currentRect = null;
                this.updateRectanglesList();
                this.draw();
                if (this.rectangles.length > 0) {
                    this.copyButton.disabled = false;
                }
            }
        }
    }

    private draw(): void {
        if (!this.image) return;

        // Redraw the image
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.image, 0, 0, this.canvas.width, this.canvas.height);

        // Draw all saved rectangles
        this.rectangles.forEach((rect) => {
            this.ctx.strokeStyle = '#667eea';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([]);
            this.ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);

            this.ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
            this.ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
        });

        // Draw current rectangle being drawn
        if (this.currentRect) {
            this.ctx.strokeStyle = '#667eea';
            this.ctx.lineWidth = 2;
            this.ctx.setLineDash([]);
            this.ctx.strokeRect(
                this.currentRect.x,
                this.currentRect.y,
                this.currentRect.width,
                this.currentRect.height
            );

            this.ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
            this.ctx.fillRect(
                this.currentRect.x,
                this.currentRect.y,
                this.currentRect.width,
                this.currentRect.height
            );
        }
    }

    private convertToOriginalCoordinates(rect: RectCoordinates): RectCoordinates {
        if (!this.image || this.originalImageWidth === 0 || this.originalImageHeight === 0) {
            return rect;
        }

        const scaleX = this.originalImageWidth / this.canvas.width;
        const scaleY = this.originalImageHeight / this.canvas.height;

        return {
            x: rect.x * scaleX,
            y: rect.y * scaleY,
            width: rect.width * scaleX,
            height: rect.height * scaleY
        };
    }

    private updateRectanglesList(): void {
        if (this.rectangles.length === 0) {
            this.rectanglesList.innerHTML = '<div>Draw rectangles to see their coordinates</div>';
            this.rectanglesList.classList.add('empty');
            return;
        }

        this.rectanglesList.classList.remove('empty');
        this.rectanglesList.innerHTML = '';

        this.rectangles.forEach((rect) => {
            const originalRect = this.convertToOriginalCoordinates(rect);
            const coords = `[${Math.round(originalRect.x)}, ${Math.round(originalRect.y)}, ${Math.round(originalRect.width)}, ${Math.round(originalRect.height)}]`;

            const item = document.createElement('div');
            item.className = 'rectangle-item';
            item.innerHTML = `
                <div class="rectangle-coords">
                    <span class="rectangle-number">#${rect.id}</span>
                    <span>${coords}</span>
                </div>
                <button class="delete-btn" data-id="${rect.id}">🗑️</button>
            `;

            const deleteBtn = item.querySelector('.delete-btn') as HTMLButtonElement;
            deleteBtn.addEventListener('click', () => this.deleteRectangle(rect.id));

            this.rectanglesList.appendChild(item);
        });
    }

    private copyAllCoordinates(): void {
        if (this.rectangles.length === 0) return;

        const allCoords = this.rectangles.map((rect, index) => {
            const originalRect = this.convertToOriginalCoordinates(rect);
            return `Rectangle ${index + 1}: [${Math.round(originalRect.x)}, ${Math.round(originalRect.y)}, ${Math.round(originalRect.width)}, ${Math.round(originalRect.height)}]`;
        }).join('\n');

        navigator.clipboard.writeText(allCoords).then(() => {
            const originalText = this.copyButton.textContent;
            this.copyButton.textContent = '✓ Copied!';
            setTimeout(() => {
                this.copyButton.textContent = originalText;
            }, 2000);
        }).catch(() => {
            alert('Failed to copy coordinates. Here they are:\n\n' + allCoords);
        });
    }

    private deleteRectangle(id: number): void {
        this.rectangles = this.rectangles.filter(rect => rect.id !== id);
        this.updateRectanglesList();
        this.draw();
        if (this.rectangles.length === 0) {
            this.copyButton.disabled = true;
        }
    }

    private clearAllRectangles(): void {
        this.rectangles = [];
        this.currentRect = null;
        this.copyButton.disabled = true;
        this.updateRectanglesList();
        this.draw();
    }

    private resetImage(): void {
        this.image = null;
        this.originalImageWidth = 0;
        this.originalImageHeight = 0;
        this.currentRect = null;
        this.rectangles = [];
        this.nextRectId = 1;
        this.isDrawing = false;
        this.dropZone.classList.remove('hidden');
        this.canvasContainer.classList.add('hidden');
        this.controls.classList.add('hidden');
        this.fileInput.value = '';
        this.copyButton.disabled = true;
        this.updateRectanglesList();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CoordinateGrabbber();
});

