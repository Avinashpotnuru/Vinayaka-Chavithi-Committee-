"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from "@/lib/dashboard-data"
import { paymentModes, type PaymentMode } from "@/lib/contributions-data"

type RecordPaymentFormProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  memberName: string
  remainingAmount: number
  onSubmit: (values: {
    amount: number
    paymentMode: PaymentMode
    paymentDate: string
  }) => void
}

export type RecordPaymentValues = {
  amount: number
  paymentMode: PaymentMode
  paymentDate: string
}

function buildRecordPaymentSchema(remaining: number) {
  return z.object({
    amount: z
      .number({ error: "Enter an amount greater than 0" })
      .positive("Enter an amount greater than 0")
      .max(
        remaining,
        `Cannot exceed the pending amount (${formatCurrency(remaining)})`,
      ),
    paymentMode: z.enum(paymentModes),
    paymentDate: z.string().min(1, "Choose a payment date"),
  })
}

export function RecordPaymentDialog({
  open,
  onOpenChange,
  memberName,
  remainingAmount,
  onSubmit,
}: RecordPaymentFormProps) {
  const form = useForm<RecordPaymentValues>({
    resolver: zodResolver(buildRecordPaymentSchema(remainingAmount)),
    defaultValues: {
      amount: remainingAmount,
      paymentMode: "UPI",
      paymentDate: "",
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>
            {memberName} still owes{" "}
            <span className="font-medium text-foreground">
              {formatCurrency(remainingAmount)}
            </span>
            .
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => {
              onSubmit({
                amount: values.amount,
                paymentMode: values.paymentMode,
                paymentDate: values.paymentDate,
              })
            })}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (₹)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Amount received"
                      {...field}
                      onChange={(event) =>
                        field.onChange(
                          event.target.value === ""
                            ? 0
                            : Number(event.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="paymentMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Mode</FormLabel>
                    <Select
                      onValueChange={(value) =>
                        field.onChange(value as PaymentMode)
                      }
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {paymentModes.map((mode) => (
                          <SelectItem key={mode} value={mode}>
                            {mode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Record Payment</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}