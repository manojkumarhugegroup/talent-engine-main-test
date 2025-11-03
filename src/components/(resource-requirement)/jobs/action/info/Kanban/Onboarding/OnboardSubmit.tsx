"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/forms/CustomCard"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/forms/CustomTable"
import { Separator } from "@/components/ui/separator"
import { Calendar, Plus, Trash2 } from "lucide-react"
import { cn, getCurrentDate, getTodayMinDate } from "@/lib/utils"
import { AssetRow, ChecklistItem, OnboardingPayload, OtherItemRow } from "@/types/jobs/Info/kanban/onboard"
import { CusDatePicker } from "@/components/forms/CusDatePicker"
import { Controller, useForm } from "react-hook-form"
import { CusInput } from "@/components/forms/CusInput"
// import axios from "axios"
import { CusCheckbox } from "@/components/forms/CustomCheckbox"
// Helper: compact label + control
function Field({
    id,
    label,
    children,
    className,
    disabled,
}: {
    id: string
    label: string
    children: React.ReactNode
    className?: string
    disabled?: boolean
}) {
    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <Label htmlFor={id} className="text-sm font-medium text-foreground">
                {label}
            </Label>
            <div className={cn(disabled && "opacity-60")}>{children}</div>
        </div>
    )
}

// Small date field with icon group (visual parity with screenshots)
function DateWithIcon({
    value,
    onChange,
    id,
}: {
    value?: string
    onChange: (v: string) => void
    id: string
}) {
    return (
        <div className="flex items-center gap-2">
            <Input id={id} type="date" value={value || ""} onChange={(e) => onChange(e.target.value)} className="h-10" />
            <Button type="button" variant="outline" size="icon" aria-label="Open calendar">
                <Calendar className="h-4 w-4" />
            </Button>
        </div>
    )
}

export default function OnboardingForm() {
    // Top dates
    const [expectedDate, setExpectedDate] = useState<string>("2025-08-01")
    const [actualDate, setActualDate] = useState<string>("2025-08-02")
    const { control, register } = useForm()

    // Checklist rows
    const [checklist, setChecklist] = useState<ChecklistItem[]>([
        {
            id: "laptop",
            label: "Laptop / Work Device Provided",
            checked: true,
            completedDate: "2025-08-02",
            completedBy: "Maddy",
            notes: "",
        },
        {
            id: "access",
            label: "Access to Tools/Portals Granted",
            checked: false,
            completedDate: "2025-08-02",
            completedBy: "Maddy",
            notes: "",
        },
        {
            id: "id-proof",
            label: "ID & Address Proof Collected",
            checked: true,
            completedDate: "2025-08-02",
            completedBy: "Maddy",
            notes: "",
        },
        {
            id: "bank",
            label: "Bank Details Submitted",
            checked: true,
            completedDate: "2025-08-02",
            completedBy: "Maddy",
            notes: "",
        },
    ])

    const allChecklistItemsChecked = checklist.every(item => item.checked)

    const updateChecklist = (id: string, patch: Partial<ChecklistItem>) => {
        setChecklist((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    }

    // Other Items
    const [otherItems, setOtherItems] = useState<OtherItemRow[]>([])
    const [otherEditorOpen, setOtherEditorOpen] = useState(false)
    const [otherDraft, setOtherDraft] = useState<{ name: string }>({ name: "" })

    const addOtherItem = () => {
        if (!otherDraft.name.trim()) return
        const id = crypto.randomUUID()
        setOtherItems((prev) => [
            ...prev,
            {
                id,
                label: otherDraft.name.trim(),
                completedDate: "2025-08-02",
                completedBy: "Maddy",
                notes: "",
            },
        ])
        setOtherDraft({ name: "" })
        setOtherEditorOpen(false)
    }

    const updateOtherItem = (id: string, patch: Partial<OtherItemRow>) => {
        setOtherItems((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    }

    const removeOtherItem = (id: string) => {
        setOtherItems((prev) => prev.filter((r) => r.id !== id))
    }

    // Assets
    const [assets, setAssets] = useState<AssetRow[]>([])
    const [assetEditorOpen, setAssetEditorOpen] = useState(false)
    const [assetDraft, setAssetDraft] = useState<{ assetId: string; assetType: string }>({
        assetId: "",
        assetType: "",
    })

    const addAsset = () => {
        if (!assetDraft.assetId.trim() || !assetDraft.assetType.trim()) return
        const id = crypto.randomUUID()
        setAssets((prev) => [
            ...prev,
            {
                id,
                assetId: assetDraft.assetId.trim(),
                assetType: assetDraft.assetType.trim(),
                allocatedOn: "2025-08-02",
                returnedOn: "",
                notes: "",
            },
        ])
        setAssetDraft({ assetId: "", assetType: "" })
        setAssetEditorOpen(false)
    }

    const updateAsset = (id: string, patch: Partial<AssetRow>) => {
        setAssets((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)))
    }

    const removeAsset = (id: string) => {
        setAssets((prev) => prev.filter((r) => r.id !== id))
    }

    // Save/Submit states
    const [isSaving, setIsSaving] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)


    const resetForm = () => {
        setExpectedDate("2025-08-01")
        setActualDate("2025-08-02")
        setChecklist([
            {
                id: "laptop",
                label: "Laptop / Work Device Provided",
                checked: true,
                completedDate: "2025-08-02",
                completedBy: "Maddy",
                notes: "",
            },
            {
                id: "access",
                label: "Access to Tools/Portals Granted",
                checked: false,
                completedDate: "2025-08-02",
                completedBy: "Maddy",
                notes: "",
            },
            {
                id: "id-proof",
                label: "ID & Address Proof Collected",
                checked: true,
                completedDate: "2025-08-02",
                completedBy: "Maddy",
                notes: "",
            },
            {
                id: "bank",
                label: "Bank Details Submitted",
                checked: true,
                completedDate: "2025-08-02",
                completedBy: "Maddy",
                notes: "",
            },
        ])
        setOtherItems([])
        setAssets([])
        setOtherEditorOpen(false)
        setAssetEditorOpen(false)
        setOtherDraft({ name: "" })
        setAssetDraft({ assetId: "", assetType: "" })
    }

    // Save function (existing)
    const save = async () => {
        setIsSaving(true)
        const payload: OnboardingPayload = {
            expectedJoiningDate: expectedDate,
            actualJoiningDate: actualDate,
            checklist,
            otherItems,
            assets,
        }

        console.log(payload, "saved")
       
    }

    // Submit function using axios
    const handleSubmit = async () => {
        console.log("Submit clicked", expectedDate, actualDate, checklist, otherItems, assets)
      
    }

    return (
        <div className="">
            {/* Top Dates */}

            <div className="flex flex-row gap-6 text-sm w-full">
                {/* Expected Joining Date */}
                <div className="flex flex-col w-1/5">
                    <label
                        htmlFor="expectedDate"
                        className="mb-1 text-[13px] font-medium text-gray-700"
                    >
                        Expected Joining Date
                    </label>
                    <div
                        className="rounded-md  bg-(--table-bg) px-3 py-2 text-sm text-gray-700"
                    >
                        {expectedDate || "-"}
                    </div>
                </div>

                {/* Actual Joining Date */}
                <div className="flex flex-col w-1/5 mt-0.5">

                    <Controller
                        name="actualDate"
                        control={control}
                        rules={{ required: "Actual Joining Date" }}
                        render={({ field }) => (
                            <div>
                                <CusDatePicker
                                    label="Actual Joining Date"
                                    value={field.value}
                                    onChange={field.onChange}
                                    minDate={new Date()}
                                />
                            </div>
                        )}
                    />
                </div>
            </div>

            {/* Card container */}
            <Card className="mt-2.5 rounded-xl shadow-sm">
                <CardContent className="px-2">
                    {/* Onboarding Checklist */}
                    <section>
                        <h2 className="mb-2.5 text-sm font-semibold">Onboarding Checklist</h2>
                        <div className="overflow-hidden rounded-lg border border-(--table-border)">
                            <Table>
                                <TableHeader className="bg-(--table-bg)">
                                    <TableRow>
                                        <TableHead className="w-[30%] border-r border-(--table-border)">Description</TableHead>
                                        <TableHead className="w-[18%] border-r border-(--table-border)">Completed Date</TableHead>
                                        <TableHead className="w-[20%] border-r border-(--table-border)">Completed by</TableHead>
                                        <TableHead className="w-[35%]">Notes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {checklist.map((row) => (
                                        <TableRow key={row.id} className="px-2">
                                            <TableCell className="border-r">
                                                <div className="flex items-center gap-3">
                                                    <CusCheckbox
                                                        checked={row.checked}
                                                        onCheckedChange={(v) => updateChecklist(row.id, { checked: Boolean(v) })}
                                                        aria-label={row.label}
                                                    />
                                                    <span className="font-medium text-sm">{row.label}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="border-r">
                                                <CusDatePicker
                                                    value={row.completedDate ? new Date(row.completedDate) : getCurrentDate()}
                                                    onChange={(date) => {
                                                        const dateString = date ? date.toISOString().split('T')[0] : ''
                                                        updateChecklist(row.id, { completedDate: dateString })
                                                    }}
                                                    required
                                                    minDate={getTodayMinDate()}
                                                />
                                            </TableCell>
                                            <TableCell className="border-r">
                                                <Input
                                                    value={row.completedBy || ""}
                                                    onChange={(e) => updateChecklist(row.id, { completedBy: e.target.value })}
                                                    placeholder="Name"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    value={row.notes || ""}
                                                    onChange={(e) => updateChecklist(row.id, { notes: e.target.value })}
                                                    placeholder=""
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </section>

                    <Separator className="my-2" />

                    {/* Other Item */}
                    <section className="">
                        <div className=" flex items-center justify-between">
                            <h2 className="text-sm font-semibold">Other Item</h2>
                            {!otherEditorOpen && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setOtherEditorOpen(true)}
                                    className="shadow-md bg-card hover:bg-card"
                                >
                                    <Plus className=" h-4 w-4" />
                                    Add New
                                </Button>
                            )}
                        </div>

                        {/* Inline editor: single Description column */}
                        {otherEditorOpen && (
                            <div className="mb-4 overflow-hidden rounded-lg border border-(--table-border)">
                                <Table>
                                    <TableHeader className="bg-(--table-bg)">
                                        <TableRow>
                                            <TableHead className="w-[30%] ">Description</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell className="w-[30%]">
                                                <div className="flex flex-col gap-2">
                                                    <Label htmlFor="other-name" className="sr-only">
                                                        Item Name
                                                    </Label>
                                                    <Input
                                                        id="other-name"
                                                        placeholder="Item Name"
                                                        value={otherDraft.name}
                                                        onChange={(e) => setOtherDraft({ name: e.target.value })}
                                                    />
                                                </div>
                                                <div className="mt-4 flex justify-end gap-3">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setOtherEditorOpen(false)
                                                            setOtherDraft({ name: "" })
                                                        }}
                                                        className="border-primary text-primary bg-transparent hover:bg-transparent hover:text-primary"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="button" onClick={addOtherItem}>
                                                        Save
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {otherItems.length > 0 && (
                            <div className="overflow-hidden rounded-lg border border-(--table-border)">
                                <Table>
                                    <TableHeader className="bg-(--table-bg)">
                                        <TableRow>
                                            <TableHead className="w-[30%] border-r border-(--table-border)">Description</TableHead>
                                            <TableHead className="w-[18%] border-r border-(--table-border)">Completed Date</TableHead>
                                            <TableHead className="w-[20%] border-r border-(--table-border)">Completed by</TableHead>
                                            <TableHead className="w-[40%]">Notes</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {otherItems.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell className="border-r">
                                                    <div className="flex items-center gap-3">
                                                        <CusCheckbox checked />
                                                        <span className="font-medium">{row.label}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="border-r">
                                                    <CusDatePicker
                                                        value={row.completedDate ? new Date(row.completedDate) : getCurrentDate()}
                                                        onChange={(date) => {
                                                            const dateString = date ? date.toISOString().split('T')[0] : ''
                                                            updateOtherItem(row.id, { completedDate: dateString })
                                                        }}
                                                        required
                                                        minDate={getTodayMinDate()}
                                                    />
                                                </TableCell>
                                                <TableCell className="border-r">
                                                    <Input
                                                        value={row.completedBy || ""}
                                                        onChange={(e) => updateOtherItem(row.id, { completedBy: e.target.value })}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Input
                                                            value={row.notes || ""}
                                                            onChange={(e) => updateOtherItem(row.id, { notes: e.target.value })}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label="Remove row"
                                                            onClick={() => removeOtherItem(row.id)}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-destructive" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </section>

                    <Separator className="my-2" />

                    {/* Assets */}
                    <section>
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold">Assets</h2>
                            {!assetEditorOpen && (
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setAssetEditorOpen(true)}
                                    className="shadow-md bg-card hover:bg-card"
                                >
                                    <Plus className=" h-4 w-4" />
                                    Add New
                                </Button>
                            )}
                        </div>

                        {/* Inline editor: Asset ID + Asset Type */}
                        {assetEditorOpen && (
                            <div className="mb-4 overflow-hidden rounded-lg border border-(--table-border)">
                                <Table>
                                    <TableHeader className="bg-(--table-bg)">
                                        <TableRow>
                                            <TableHead>Description</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 px-1">
                                                    <Field id="asset-id" label="Asset ID">
                                                        <Input
                                                            id="asset-id"
                                                            value={assetDraft.assetId}
                                                            onChange={(e) => setAssetDraft((s) => ({ ...s, assetId: e.target.value }))}
                                                            placeholder="A0010"
                                                        />
                                                    </Field>

                                                    
                                                    <Field id="asset-type" label="Asset Type" >


                                                        <Input
                                                            id="asset-type"
                                                            value={assetDraft.assetType}
                                                            onChange={(e) => setAssetDraft((s) => ({ ...s, assetType: e.target.value }))}
                                                            placeholder="Laptop"
                                                        />
                                                    </Field>
                                                </div>
                                                <div className="mt-4 flex justify-end gap-3">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setAssetEditorOpen(false)
                                                            setAssetDraft({ assetId: "", assetType: "" })
                                                        }}
                                                        className="border-primary text-primary bg-transparent hover:bg-transparent hover:text-primary"
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="button" onClick={addAsset}>
                                                        Save
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>
                        )}

                        {assets.length > 0 && (
                            <div className="overflow-hidden rounded-lg border border-(--table-border)">
                                <Table>
                                    <TableHeader className="bg-(--table-bg)">
                                        <TableRow>
                                            <TableHead className="w-[18%] border-r border-(--table-border)">Asset ID</TableHead>
                                            <TableHead className="w-[18%] border-r border-(--table-border)">Asset Type</TableHead>
                                            <TableHead className="w-[18%] border-r border-(--table-border)">Allocated on</TableHead>
                                            <TableHead className="w-[18%] border-r border-(--table-border)">Returned on</TableHead>
                                            <TableHead className="w-[30%]">Notes</TableHead>
                                            <TableHead className="w-[2%]"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {assets.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell className="font-medium border-r">{row.assetId}</TableCell>
                                                <TableCell className="font-medium border-r">{row.assetType}</TableCell>
                                                <TableCell className="border-r">
                                                    <CusDatePicker
                                                        value={row.allocatedOn ? new Date(row.allocatedOn) : getCurrentDate()}
                                                        onChange={(date) => {
                                                            const dateString = date ? date.toISOString().split('T')[0] : ''
                                                            updateAsset(row.id, { allocatedOn: dateString })
                                                        }}
                                                        required
                                                        minDate={getTodayMinDate()}
                                                    />
                                                </TableCell>
                                                <TableCell className="border-r">
                                                    <CusDatePicker
                                                        value={row.returnedOn ? new Date(row.returnedOn) : getCurrentDate()}
                                                        onChange={(date) => {
                                                            const dateString = date ? date.toISOString().split('T')[0] : ''
                                                            updateAsset(row.id, { returnedOn: dateString })
                                                        }}
                                                        required
                                                        minDate={getTodayMinDate()}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        value={row.notes || ""}
                                                        onChange={(e) => updateAsset(row.id, { notes: e.target.value })}
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label="Remove row"
                                                        onClick={() => removeAsset(row.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-destructive" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </section>
                </CardContent>
            </Card>

            {/* Footer buttons */}
            <div className="mt-6 grid grid-cols-2 gap-4">
                <Button
                    type="button"
                    variant="outline"
                    className="h-11 border-(--interview) text-(--interview) hover:bg-transparent hover:text-(--interview) bg-transparent rounded-sm"
                    onClick={save}
                    disabled={isSaving || isSubmitting}
                >
                    {isSaving ? "Saving..." : "Save"}
                </Button>
                <Button
                    type="button"
                    className="h-11 bg-(--interview) text-white rounded-sm"
                    disabled={!allChecklistItemsChecked || isSaving || isSubmitting}
                    onClick={handleSubmit}
                >
                    {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
            </div>
        </div>
    )
}