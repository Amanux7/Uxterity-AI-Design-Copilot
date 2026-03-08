"use client";

import { useState, useCallback, useRef } from "react";

interface UploadZoneProps {
    onFileSelected: (file: File) => void;
    isLoading?: boolean;
}

const ACCEPTED = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_MB = 10;

export default function UploadZone({ onFileSelected, isLoading }: UploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const validate = (file: File): string | null => {
        if (!ACCEPTED.includes(file.type)) return "Please upload a PNG, JPG, or WebP image.";
        if (file.size > MAX_MB * 1024 * 1024) return `File too large. Max ${MAX_MB}MB allowed.`;
        return null;
    };

    const processFile = useCallback((file: File) => {
        const err = validate(file);
        if (err) { setError(err); return; }
        setError(null);
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(file);
        onFileSelected(file);
    }, [onFileSelected]);

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) processFile(file);
    }, [processFile]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
    };

    return (
        <div
            className={`upload-zone glass-card rounded-2xl border-2 border-dashed cursor-pointer relative overflow-hidden
        ${isDragging ? "dragging border-purple-500" : "border-purple-500/20 hover:border-purple-500/40"}
        ${isLoading ? "pointer-events-none opacity-60" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => !isLoading && inputRef.current?.click()}
            style={{ minHeight: 260 }}
        >
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED.join(",")}
                className="hidden"
                onChange={onInputChange}
                id="file-upload"
            />

            {/* Shimmer effect when dragging */}
            {isDragging && <div className="absolute inset-0 shimmer-bg pointer-events-none" />}

            <div className="flex flex-col items-center justify-center p-10 gap-5 text-center">
                {preview ? (
                    <>
                        {/* Image preview */}
                        <div className="relative rounded-xl overflow-hidden border border-purple-500/20 max-h-40">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={preview} alt="Preview" className="max-h-40 max-w-full object-contain" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-semibold text-[#c4c9e8]">✓ {fileName}</span>
                            <span className="text-xs text-[#4b5280]">Click to change</span>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Upload icon */}
                        <div
                            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl
                ${isDragging ? "bg-purple-500/20" : "bg-purple-500/10"}
                transition-all duration-300`}
                        >
                            {isDragging ? "✦" : "⬆"}
                        </div>

                        <div className="space-y-1">
                            <p className="text-base font-semibold text-[#c4c9e8]">
                                {isDragging ? "Drop your UI screenshot here" : "Drag & drop your UI screenshot"}
                            </p>
                            <p className="text-sm text-[#4b5280]">
                                or <span className="text-purple-400 underline underline-offset-2">browse files</span>
                            </p>
                        </div>

                        <div className="flex gap-2 flex-wrap justify-center">
                            {["PNG", "JPG", "WebP"].map((fmt) => (
                                <span
                                    key={fmt}
                                    className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-[#4b5280] border border-white/5"
                                >
                                    {fmt}
                                </span>
                            ))}
                            <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-[#4b5280] border border-white/5">
                                Max 10MB
                            </span>
                        </div>
                    </>
                )}

                {error && (
                    <p className="text-xs text-red-400 bg-red-500/10 px-3 py-2 rounded-lg border border-red-500/20">
                        ⚠ {error}
                    </p>
                )}
            </div>
        </div>
    );
}
