import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from '@/components/ui/form';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { DateModeSelector, type DateMode, type TimeException } from './DateModeSelector';
import { toDateKey } from '@/lib/eventSchedule';
const eventFormSchema = z.object({
  title: z.string().trim().min(3, 'O título deve ter pelo menos 3 caracteres').max(100, 'O título deve ter no máximo 100 caracteres'),
  description: z.string().trim().min(10, 'A descrição deve ter pelo menos 10 caracteres').max(1000, 'A descrição deve ter no máximo 1000 caracteres'),
  type: z.enum(['theater', 'presentation', 'lecture', 'fair', 'workshop', 'exhibition', 'sports', 'other'], { required_error: 'Selecione o tipo de evento' }),
  customType: z.string().trim().max(60, 'Máximo 60 caracteres').optional(),
  registrationType: z.enum(['registration', 'open'], { required_error: 'Selecione o tipo de inscrição' }),
  date: z.date().optional(),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora inválido (HH:MM)'),
  duration: z.coerce.number().min(15, 'Duração mínima de 15 minutos').max(480, 'Duração máxima de 480 minutos'),
  location: z.string().trim().min(3, 'O local deve ter pelo menos 3 caracteres').max(200, 'O local deve ter no máximo 200 caracteres'),
  maxParticipants: z.coerce.number().min(1, 'Mínimo de 1 participante').max(1000, 'Máximo de 1000 participantes').optional(),
});

export type EventFormValues = z.infer<typeof eventFormSchema>;

export interface EventFormExtras {
  coverImage?: string;
  galleryImages?: string[];
  enableAttendance: boolean;
  dateMode: DateMode;
  dates: Date[];
  timeExceptions: TimeException[];
}

interface EventFormProps {
  defaultValues?: Partial<EventFormValues>;
  defaultCoverImage?: string;
  defaultGalleryImages?: string[];
  defaultEnableAttendance?: boolean;
  defaultDateMode?: DateMode;
  defaultDates?: Date[];
  defaultTimeExceptions?: TimeException[];
  onSubmit: (values: EventFormValues, extras: EventFormExtras) => void;
  onCancel: () => void;
  isEditing?: boolean;
}

export function EventForm({
  defaultValues,
  defaultCoverImage,
  defaultGalleryImages,
  defaultEnableAttendance,
  defaultDateMode,
  defaultDates,
  defaultTimeExceptions,
  onSubmit,
  onCancel,
  isEditing = false,
}: EventFormProps) {
  const [coverImage, setCoverImage] = useState<string | undefined>(defaultCoverImage);
  const [galleryImages, setGalleryImages] = useState<string[]>(defaultGalleryImages || []);
  const [enableAttendance, setEnableAttendance] = useState<boolean>(defaultEnableAttendance ?? true);
  const [dateMode, setDateMode] = useState<DateMode>(defaultDateMode || 'single');
  const [dates, setDates] = useState<Date[]>(defaultDates || (defaultValues?.date ? [defaultValues.date] : []));
  const [hasTimeExceptions, setHasTimeExceptions] = useState<boolean>((defaultTimeExceptions?.length ?? 0) > 0);
  const [timeExceptions, setTimeExceptions] = useState<TimeException[]>(defaultTimeExceptions || []);
  const [pendingTimeException, setPendingTimeException] = useState<TimeException | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '', description: '', type: undefined, registrationType: 'registration',
      date: undefined, time: '', duration: 60, location: '', maxParticipants: 50,
      ...defaultValues,
    },
  });

  const registrationType = form.watch('registrationType');

  const handleFileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  };

  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = await handleFileToDataUrl(file);
      setCoverImage(url);
    }
  };

  const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 6 - galleryImages.length;
    const toAdd = Array.from(files).slice(0, remaining);
    const urls = await Promise.all(toAdd.map(handleFileToDataUrl));
    setGalleryImages((prev) => [...prev, ...urls]);
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = (values: EventFormValues) => {
    if (dates.length === 0) {
      toast.error('Selecione pelo menos uma data para o evento.');
      return;
    }

    const selectedDateKeys = new Set(dates.map((date) => toDateKey(date)).filter(Boolean));
    const mergedExceptions = new Map<string, TimeException>();

    timeExceptions.forEach((exception) => {
      const key = toDateKey(exception.date);
      if (!key || !selectedDateKeys.has(key)) return;
      mergedExceptions.set(key, { ...exception, date: key });
    });

    if (hasTimeExceptions && pendingTimeException) {
      const pendingKey = toDateKey(pendingTimeException.date);
      if (pendingKey && selectedDateKeys.has(pendingKey)) {
        mergedExceptions.set(pendingKey, { ...pendingTimeException, date: pendingKey });
      }
    }

    const finalEnableAttendance = values.registrationType === 'open' ? false : enableAttendance;

    onSubmit(values, {
      coverImage,
      galleryImages: galleryImages.length > 0 ? galleryImages : undefined,
      enableAttendance: finalEnableAttendance,
      dateMode,
      dates,
      timeExceptions: hasTimeExceptions
        ? Array.from(mergedExceptions.values()).sort((a, b) => a.date.localeCompare(b.date))
        : [],
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <FormField control={form.control} name="title" render={({ field }) => (
          <FormItem>
            <FormLabel>Nome do Evento</FormLabel>
            <FormControl><Input placeholder="Ex: Peça de Teatro - Hamlet" maxLength={100} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Descrição</FormLabel>
            <FormControl><Textarea placeholder="Descreva o evento em detalhe..." className="min-h-[120px]" maxLength={1000} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        {/* Cover Image */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Imagem de capa</label>
          <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          {coverImage ? (
            <div className="relative rounded-lg overflow-hidden h-40">
              <img src={coverImage} alt="Capa" className="w-full h-full object-cover" />
              <Button type="button" variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7"
                onClick={() => setCoverImage(undefined)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button type="button" variant="outline" className="w-full h-24 gap-2 border-dashed"
              onClick={() => coverInputRef.current?.click()}>
              <ImagePlus className="h-5 w-5" />
              Adicionar imagem de capa
            </Button>
          )}
        </div>

        {/* Gallery */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Galeria de fotos (até 6)</label>
          <input ref={galleryInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryChange} />
          <div className="grid grid-cols-3 gap-2">
            {galleryImages.map((img, i) => (
              <div key={i} className="relative rounded-lg overflow-hidden aspect-video">
                <img src={img} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => removeGalleryImage(i)}>
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
            {galleryImages.length < 6 && (
              <Button type="button" variant="outline" className="aspect-video border-dashed gap-1 text-xs"
                onClick={() => galleryInputRef.current?.click()}>
                <ImagePlus className="h-4 w-4" />
                Foto
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="type" render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria do Evento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Selecione a categoria" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="theater">Teatro</SelectItem>
                  <SelectItem value="presentation">Apresentação</SelectItem>
                  <SelectItem value="lecture">Palestra</SelectItem>
                  <SelectItem value="fair">Feira</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="exhibition">Exposição</SelectItem>
                  <SelectItem value="sports">Torneio Desportivo</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />

          {form.watch('type') === 'other' && (
            <FormField control={form.control} name="customType" render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo personalizado</FormLabel>
                <FormControl><Input placeholder="Ex: Concerto, Debate..." maxLength={60} {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )} />
          )}

          <FormField control={form.control} name="registrationType" render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Evento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="registration">Com inscrições</SelectItem>
                  <SelectItem value="open">Evento aberto</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* Multi-date selector */}
        <DateModeSelector
          dateMode={dateMode}
          onDateModeChange={setDateMode}
          singleDate={dates[0]}
          onSingleDateChange={(d) => { form.setValue('date', d); }}
          dates={dates}
          onDatesChange={(d) => { setDates(d); if (d[0]) form.setValue('date', d[0]); }}
          defaultTime={form.watch('time') || '09:00'}
          defaultDuration={form.watch('duration') || 60}
          hasTimeExceptions={hasTimeExceptions}
          onHasTimeExceptionsChange={(value) => {
            setHasTimeExceptions(value);
            if (!value) {
              setTimeExceptions([]);
              setPendingTimeException(null);
            }
          }}
          timeExceptions={timeExceptions}
          onTimeExceptionsChange={setTimeExceptions}
          onExceptionDraftChange={setPendingTimeException}
        />

        <FormField control={form.control} name="location" render={({ field }) => (
          <FormItem>
            <FormLabel>Local</FormLabel>
            <FormControl><Input placeholder="Ex: Auditório Principal" maxLength={200} {...field} /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="time" render={({ field }) => (
            <FormItem>
              <FormLabel>Hora (padrão)</FormLabel>
              <FormControl><Input type="time" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
          <FormField control={form.control} name="duration" render={({ field }) => (
            <FormItem>
              <FormLabel>Duração (minutos)</FormLabel>
              <FormControl><Input type="number" min={15} max={480} {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        </div>

        {/* Max participants - only for registration events */}
        {registrationType === 'registration' && (
          <FormField control={form.control} name="maxParticipants" render={({ field }) => (
            <FormItem>
              <FormLabel>Limite de inscrições</FormLabel>
              <FormControl><Input type="number" min={1} max={1000} placeholder="Ex: 50" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )} />
        )}

        {/* Attendance toggle - only for registration events */}
        {registrationType === 'registration' && (
          <div className="flex items-center justify-between rounded-lg border border-border p-4">
            <div>
              <p className="text-sm font-medium">Confirmação de presença</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permite marcar e desmarcar presença dos participantes neste evento.
              </p>
            </div>
            <Switch
              checked={enableAttendance}
              onCheckedChange={setEnableAttendance}
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button type="submit">{isEditing ? 'Guardar Alterações' : 'Criar Evento'}</Button>
        </div>
      </form>
    </Form>
  );
}