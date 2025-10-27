import React, { useState, useEffect, useRef } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "./ui/card"
import { Button } from "./ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs"
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react"

export default function GalleryWidget({ className = "" }) {
  const [images, setImages] = useState([])
  const [publicImages, setPublicImages] = useState([])
  const [chooserOpen, setChooserOpen] = useState(false)
  const fileInputRef = useRef(null)
  const containerRef = useRef(null)
  const [visibleIndex, setVisibleIndex] = useState(0)
  const [chooserError, setChooserError] = useState("")
  const MAX_IMAGES = 3

  // Load optional public images (mock)
  useEffect(() => {
    let cancelled = false
    const loadManifest = async () => {
      try {
        const res = await fetch("/gallery-manifest.json")
        if (!res.ok) return
        const list = await res.json()
        if (!cancelled) setPublicImages(Array.isArray(list) ? list : [])
      } catch {
        console.debug("No gallery manifest found")
      }
    }
    loadManifest()
    return () => (cancelled = true)
  }, [])

  const handleAddImage = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (images.length >= MAX_IMAGES) {
      setChooserError(`You can only add up to ${MAX_IMAGES} images.`)
      return
    }
    const url = URL.createObjectURL(file)
    setImages((prev) => {
      const next = [...prev, url]
      setVisibleIndex(next.length - 1)
      return next
    })
    setChooserError("")
  }

  const handleAddPublicImage = (src) => {
    if (images.length >= MAX_IMAGES) {
      setChooserError(`You can only add up to ${MAX_IMAGES} images.`)
      return
    }
    setImages((prev) => {
      const next = [...prev, src]
      setVisibleIndex(next.length - 1)
      return next
    })
    setChooserError("")
    setChooserOpen(false)
  }

  const handlePrev = () => setVisibleIndex((i) => Math.max(0, i - 1))
  const handleNext = () => setVisibleIndex((i) => Math.min(images.length - 1, i + 1))

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const child = container.children[visibleIndex]
    if (child?.scrollIntoView) {
      child.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
    }
  }, [visibleIndex, images])

  const handleDeleteImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  useEffect(() => {
    setVisibleIndex((i) => (images.length ? Math.min(i, images.length - 1) : 0))
  }, [images.length])

  return (
    <Card
      className={`w-full max-w-full md:max-w-2xl h-auto md:h-[400px] flex flex-col bg-[#1f2933] border-0 rounded-2xl p-4 md:p-8 text-gray-300 shadow-[inset_6px_6px_18px_rgba(0,0,0,0.6),inset_-6px_-6px_16px_rgba(255,255,255,0.02)] ${className}`}
    >
      <CardHeader className="flex items-center justify-between p-0 mb-4">
        <div className="flex items-center gap-3">
          <div className="py-2 px-6 md:px-8 flex items-center justify-center rounded-lg bg-[#12161a] border border-[#39445A] shadow-lg">
            <CardTitle className="text-white text-base md:text-lg font-semibold tracking-wide">
              Gallery
            </CardTitle>
          </div>
        </div>

        <CardAction className="p-0">
          <div className="flex items-center gap-2 md:gap-3 relative">
            {/* Add Image button + chooser */}
            <div className="relative">
              <Button
                variant="outline"
                onClick={() => setChooserOpen((s) => !s)}
                className="bg-[#2C354A] border border-[#39445A] text-white hover:bg-[#39445A] hover:scale-105 transition-transform text-xs md:text-sm"
              >
                <Plus className="mr-1.5 md:mr-2 h-4 w-4" /> Add Image
              </Button>

              {chooserOpen && (
                <div className="absolute right-0 mt-2 w-64 md:w-72 bg-[#0f1720] border border-[#233043] rounded-lg p-3 shadow-lg z-50">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm text-white">Add image</strong>
                      <button
                        className="text-gray-400 hover:text-gray-200"
                        onClick={() => setChooserOpen(false)}
                        aria-label="Close"
                      >
                        ✕
                      </button>
                    </div>

                    <Tabs defaultValue="upload">
                      <TabsList className="grid grid-cols-2 mb-2 bg-[#222831] rounded-lg">
                        <TabsTrigger value="upload" className="text-xs md:text-sm">Upload</TabsTrigger>
                        <TabsTrigger value="public" className="text-xs md:text-sm">Public</TabsTrigger>
                      </TabsList>

                      <TabsContent value="upload">
                        <div className="flex gap-2 mt-2">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAddImage}
                          />
                          <Button
                            onClick={() =>
                              fileInputRef.current && fileInputRef.current.click()
                            }
                            variant="outline"
                            className={`flex-1 text-xs md:text-sm ${
                              images.length >= MAX_IMAGES
                                ? "opacity-50 pointer-events-none"
                                : ""
                            }`}
                            disabled={images.length >= MAX_IMAGES}
                          >
                            Upload from device
                          </Button>
                        </div>
                      </TabsContent>

                      <TabsContent value="public">
                        <div className="mt-2">
                          {chooserError && (
                            <div className="text-xs text-rose-400 mb-2">{chooserError}</div>
                          )}
                          {publicImages.length === 0 ? (
                            <div className="text-xs text-gray-500">
                              No public images found.
                            </div>
                          ) : (
                            <div className="grid grid-cols-3 gap-2">
                              {publicImages.map((p, i) => (
                                <Button
                                  key={i}
                                  onClick={() => handleAddPublicImage(p)}
                                  variant="ghost"
                                  className={`w-full h-16 rounded overflow-hidden bg-[#2B3243] ${
                                    images.length >= MAX_IMAGES
                                      ? "opacity-40 pointer-events-none"
                                      : ""
                                  }`}
                                  disabled={images.length >= MAX_IMAGES}
                                >
                                  <img
                                    src={p}
                                    alt={`public-${i}`}
                                    className="w-full h-full object-cover"
                                  />
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              )}
            </div>

            {/* Arrows */}
            <Button
              size="icon"
              variant="ghost"
              onClick={handlePrev}
              disabled={visibleIndex <= 0}
              className={`w-8 md:w-10 h-8 md:h-10 rounded-full bg-[#2B3243] hover:bg-[#39445A] text-gray-300 hover:scale-105 transition-all ${
                visibleIndex <= 0 ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <ChevronLeft className="h-4 w-4 md:h-5 md:w-5" />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={handleNext}
              disabled={visibleIndex >= images.length - 1}
              className={`w-8 md:w-10 h-8 md:h-10 rounded-full bg-[#2B3243] hover:bg-[#39445A] text-gray-300 hover:scale-105 transition-all ${
                visibleIndex >= images.length - 1
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              <ChevronRight className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      {/* Image Gallery */}
      <CardContent className="flex-1 overflow-hidden p-0">
        <div
          id="gallery-scroll"
          ref={containerRef}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-[#2C354A] scrollbar-track-transparent pb-3"
        >
          {images.length === 0 ? (
            <div className="w-full flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-xs md:text-sm text-gray-300 mb-3">
                  No images yet — add up to 3 images.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setChooserOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Image
                </Button>
              </div>
            </div>
          ) : (
            images.map((src, index) => (
              <div
                key={index}
                className={`shrink-0 w-[140px] md:w-[180px] h-[100px] md:h-[130px] rounded-xl overflow-hidden bg-[#2B3243] shadow-inner transition-all duration-300 relative group ${
                  index === visibleIndex
                    ? "ring-2 ring-offset-2 ring-indigo-500 scale-105 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                    : "hover:scale-110 hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:-translate-y-1"
                }`}
              >
                <img
                  src={src}
                  alt={`Uploaded ${index + 1}`}
                  className="object-cover w-full h-full"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteImage(index)
                  }}
                  className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/50 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-black/70 hover:text-white transition-all duration-200"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </CardContent>

      {/* Scrollbar styling */}
      <style jsx>{`
        #gallery-scroll::-webkit-scrollbar {
          height: 8px;
        }
        #gallery-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.06);
          border-radius: 999px;
        }
        #gallery-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
      `}</style>
    </Card>
  )
}
