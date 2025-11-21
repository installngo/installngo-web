"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Course } from "@/components/courses/types/Course";

interface CourseCardProps {
  course: Course;
  onView?: (courseId: string) => void;
  onEdit?: (courseId: string) => void;
  onDelete?: (courseId: string) => void;
}

// Cache signed URLs with expiry
const signedUrlCache = new Map<string, { url: string; expiresAt: number }>();

export default function CourseCard({ course, onEdit }: CourseCardProps) {
  const [imageUrl, setImageUrl] = useState<string>("/course-placeholder.png");

  useEffect(() => {
    let isMounted = true;
    const thumbnail = course.thumbnail_url;

    const loadImage = async () => {
      if (!thumbnail) {
        setImageUrl("/course-placeholder.png");
        return;
      }

      const cached = signedUrlCache.get(thumbnail);
      if (cached && Date.now() < cached.expiresAt) {
        setImageUrl(cached.url);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `/api/storage/download?path=${encodeURIComponent(thumbnail)}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        const json: { success: boolean; url?: string } = await res.json();

        if (json.success && json.url) {
          const img = new window.Image();
          img.src = json.url;
          img.onload = () => {
            if (!isMounted) return;
            signedUrlCache.set(thumbnail, {
              url: json.url!,
              expiresAt: Date.now() + 5 * 60 * 1000,
            });
            setImageUrl(json.url!);
          };
          img.onerror = () => {
            if (!isMounted) return;
            setImageUrl("/course-placeholder.png");
          };
        } else {
          setImageUrl("/course-placeholder.png");
        }
      } catch {
        if (!isMounted) return;
        setImageUrl("/course-placeholder.png");
      }
    };

    loadImage();

    return () => {
      isMounted = false;
    };
  }, [course.thumbnail_url]);

  return (
    <div
      className="rounded-2xl overflow-hidden shadow-md flex flex-col bg-[var(--card-bg)]"
      style={{ width: "280px" }}
    >
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        <Image
          src={imageUrl}
          alt={course.course_title ?? "Course Image"}
          fill
          className="object-cover w-full h-full"
          loading="lazy"
        />
      </div>

      {/* Footer with Edit Button */}
      <div className="p-3 flex justify-end">
        <button
          onClick={() => onEdit?.(course.course_id)}
          className="text-blue-600 hover:text-blue-800 underline text-sm transition"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
