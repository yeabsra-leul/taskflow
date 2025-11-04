// app/workspaces/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Plus,
  Search,
  Settings,
  MoreVertical,
  Users,
  LayoutGrid,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useWorkspaceStore } from "@/store/workspaceStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaces } from "@/lib/hooks/useWorkspaces";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { colorOptions } from "@/lib/constants";
import { generateSlug, hexToRgba } from "@/lib/utils";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSubscription } from "@/lib/hooks/useSubscription";
import { PlanBadge } from "@/components/ui/plan-badge";

// SKELETON COMPONENT
function WorkspaceSkeleton() {
  return (
    <Card className="h-60">
      <CardContent className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <div className="flex gap-6">
          <Skeleton className="h-12 w-20" />
          <Skeleton className="h-12 w-20" />
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-10" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function WorkspacesPage() {
  const { user, checkCurrentUserPlan } = useAuth();
  const {
    workspaces,
    isLoadingWorkspaces,
    error,
    createWorkspace,
    creatingWorkspace,
  } = useWorkspaces();
  const { setActiveWorkspace } = useWorkspaceStore();
  const router = useRouter();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<{ name: string; color: string }>({
    name: "",
    color: "#3b82f6",
  });

  // Filter workspaces
  const filteredWorkspaces = workspaces.filter((ws) => {
    if (searchQuery.trim() === "") {
      return true;
    }

    return ws.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  //check if user can create more workspaces
  const canCreateWorkspace =
    (checkCurrentUserPlan("free") && workspaces.length < 1) ||
    (checkCurrentUserPlan("premium") && workspaces.length < 5) ||
    checkCurrentUserPlan("enterprise");

  // Create workspace handler
  const handleCreateWorkspace = async () => {
    if (!formData.name.trim()) return;
    if (!canCreateWorkspace) {
      setShowUpgradeDialog(true);
      return;
    }

    try {
      const slug = generateSlug(formData.name, user?.user_id || "");
      const newWs = await createWorkspace({
        name: formData.name,
        slug,
        color: formData.color,
      });
      setActiveWorkspace(newWs);
      toast.success("Workspace created!");
      setIsCreateOpen(false);
      setFormData({ name: "", color: "#3b82f6" });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to create workspace"
      );
    }
  };

  // Loading state
  if (isLoadingWorkspaces) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border sticky top-0 z-40 bg-background/80 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-6 py-6">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
            <div className="flex gap-4 mt-6">
              <Skeleton className="h-10 w-96" />
              <Skeleton className="h-10 w-40" />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <WorkspaceSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="border-b border-border sticky top-0 z-40 bg-background/50 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex items-center space-x-4">
                <h1 className="text-3xl font-bold mb-2">Workspaces</h1>
                <PlanBadge plan={"free"} />
              </div>
              <p className="text-muted-foreground">
                Manage and organize your workspaces
              </p>
            </div>

            {/* Search and Create */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workspaces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-muted/50 border-border"
                />
              </div>
              <Button
                onClick={() => setIsCreateOpen(true)}
                className="w-full sm:w-auto gap-2"
              >
                <Plus className="h-4 w-4" />
                New Workspace
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredWorkspaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkspaces.map((workspace) => (
              <motion.div key={workspace.id} variants={itemVariants}>
                <Card className="h-auto hover:shadow-lg transition-all duration-300 overflow-hidden group relative backdrop-blur-2xl">
                  <div
                    className={`absolute top-4 right-4 w-40 h-40 opacity-10 transform translate-x-8 -translate-y-8 rounded-full blur-2xl`}
                    style={{
                      background: `linear-gradient(to bottom right, ${workspace.color}, ${workspace.color})`,
                    }}
                  />

                  <CardContent className="p-6 relative z-10">
                    {/* Workspace Card */}
                    <div className="rounded-lg p-0">
                      {/* Header with Actions */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                            {workspace.name}
                          </h3>
                        </div>
                        <button className="p-2 hover:outline-[0.5] rounded-sm transition-colors opacity-0 group-hover:opacity-100 cursor-pointer">
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>

                      {/* Stats */}
                      <div className="flex gap-4 mb-6">
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-lg`}
                            style={{
                              backgroundColor: hexToRgba(workspace.color, 0.15),
                              color: workspace.color,
                            }}
                          >
                            <Users className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold">10</div>
                            <div className="text-xs text-muted-foreground">
                              Members
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-lg`}
                            style={{
                              backgroundColor: hexToRgba(workspace.color, 0.15),
                              color: workspace.color,
                            }}
                          >
                            <LayoutGrid className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold">11</div>
                            <div className="text-xs text-muted-foreground">
                              Boards
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="flex-1 group/btn bg-transparent hover:bg-accent/50 transition-colors"
                          onClick={() => setActiveWorkspace(workspace)}
                        >
                          <Link
                            href={`/w/${workspace.slug}`}
                            className="flex items-center gap-2"
                          >
                            <span>Open</span>
                            <ArrowRight className="size-3 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm" className="px-3">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            {/* Create New Workspace Card */}
            <motion.div variants={itemVariants}>
              <Card
                className="group relative overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-all duration-200 cursor-pointer bg-muted/20 hover:bg-muted/40 rounded-md min-h-60 my-auto"
                onClick={() => setIsCreateOpen(true)}
              >
                <CardContent className="flex flex-col items-center justify-center h-full space-y-2">
                  <div className="h-16 w-16 rounded-full bg-gray-200 group-hover:bg-gray-300 flex items-center justify-center transition-colors">
                    <Plus className="h-8 w-8" />
                  </div>
                  <h3 className="text-md font-medium">Create New Workspace</h3>
                  <p className="text-sm">
                    Add a new workspace to organize your projects
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-flex h-16 w-16 rounded-xl bg-muted/30 items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No workspaces found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or create a new workspace
            </p>
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Workspace
            </Button>
          </motion.div>
        )}
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace to organize your projects and teams.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Workspace Name
              </label>
              <Input
                placeholder="e.g., Product Team"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-muted/50"
              />
            </div>

            {/* board color selector */}
            <div className="space-y-4">
              <Label className="text-sm font-medium">Board Color</Label>
              <div className="flex rounded-xl overflow-hidden shadow-lg border border-border">
                {colorOptions.map((color, index) => (
                  <button
                    key={color.hex}
                    onClick={() =>
                      setFormData({ ...formData, color: color.hex })
                    }
                    className="group relative flex-1 focus:outline-none focus:z-10 cursor-pointer"
                    title={color.name}
                  >
                    <div
                      className={`relative h-24 transition-all duration-200
                        ${index === 0 && "rounded-l-md"}
                        ${index === colorOptions.length - 1 && "rounded-r-md"}
                      `}
                      style={{ backgroundColor: color.hex }}
                    >
                      {formData.color === color.hex && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-6 w-6 rounded-full bg-white shadow-lg flex items-center justify-center animate-in zoom-in-50 duration-100">
                            <Check className="h-3 w-3 text-gray-700 stroke-[3]" />
                          </div>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-white/0 to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <span className="text-xs font-medium text-foreground bg-background px-2 py-1 rounded shadow-sm whitespace-nowrap">
                          {color.name}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Select a theme color for your workspace
              </p>
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateWorkspace}
              disabled={!formData.name.trim()}
            >
              {creatingWorkspace && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Workspace
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* upgrade to pro dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
          <DialogHeader>
            <DialogTitle>Upgrade to Create More Workspaces</DialogTitle>
            {checkCurrentUserPlan("free") ? (
              <p className="text-sm text-gray-600">
                Free users can only create one workspace. Upgrade to Pro or
                Enterprise to create more workspaces.
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Pro users can only create 5 workspaces. Upgrade to Enterprise to
                create more workspaces.
              </p>
            )}
          </DialogHeader>
          <div className="flex justify-end space-x-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowUpgradeDialog(false)}
            >
              Cancel
            </Button>
            <Link href="/pricing" className="no-underline cursor-pointer">
              <Button>View Plans</Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
