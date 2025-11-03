import { Skeleton } from "@/components/ui/skeleton"
import { View } from "react-native"


export function SkeletonCategoryRow() {
  return (
    <>
        {
            Array.from({ length: 6 }).map((_, i) => (
                <View className="border border-border rounded-xl bg-card mb-2 shadow-sm">
                    <View className="flex-row items-center gap-4 p-4">

                        <Skeleton className="h-14 w-14 rounded-lg" />

                        <View className="flex-1 gap-2">
                        <Skeleton className="h-4 w-[80%]" />
                        <Skeleton className="h-4 w-[60%]" />
                        </View>

                        <Skeleton className="h-8 w-16 rounded-lg" />
                    </View>
                </View>
            ))
        }
    </>
  )
}

