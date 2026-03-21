'use client'
// src/app/admin/beats/new/page.tsx
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Upload, Plus, X, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_LICENSE_TIERS, LICENSE_TIER_ORDER } from '@/lib/license-tiers'
import toast from 'react-hot-toast'
import type { LicenseTier } from '@/types'

const GENRE_OPTIONS = ['Trap', 'Drill', 'Afrobeats', 'R&B', 'Pop', 'Cinematic', 'Lo-Fi', 'Gospel', 'Hip-Hop', 'Dancehall']
const MOOD_OPTIONS  = ['Dark', 'Melodic', 'Aggressive', 'Chill', 'Hype', 'Romantic', 'Epic', 'Motivational', 'Sad', 'Bounce']
const KEY_OPTIONS   = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'Cm', 'C#m', 'Dm', 'D#m', 'Em', 'Fm', 'F#m', 'Gm', 'G#m', 'Am', 'A#m', 'Bm']

export default function NewBeatPage() {
  const router = useRouter()
  const supabase = createClient()
  const [saving, setSaving] = useState(false)

  const [form, setForm] = useState({
    title: '',
    bpm: '',
    key: 'Am',
    genre: [] as string[],
    mood: [] as string[],
    similar_artists: '',
    description: '',
  })

  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [previewFile, setPreviewFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState<string>('')

  const [licenses, setLicenses] = useState(
    LICENSE_TIER_ORDER.map(tier => ({
      tier,
      enabled: tier !== 'exclusive',
      price: DEFAULT_LICENSE_TIERS[tier].default_price,
    }))
  )

  const toggleTag = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setCoverFile(f)
    setCoverPreview(URL.createObjectURL(f))
  }

  const slugify = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') +
    '-' + Date.now().toString(36)

  const handleSubmit = async () => {
    if (!form.title || !form.bpm || !form.key) {
      toast.error('Fill in title, BPM, and key')
      return
    }
    if (!previewFile) {
      toast.error('Upload a preview audio file')
      return
    }

    setSaving(true)
    try {
      const slug = slugify(form.title)

      // Upload cover art
      let coverUrl = ''
      if (coverFile) {
        const { data } = await supabase.storage
          .from('beat-covers')
          .upload(`${slug}/cover.${coverFile.name.split('.').pop()}`, coverFile, { upsert: true })
        if (data) {
          const { data: url } = supabase.storage.from('beat-covers').getPublicUrl(data.path)
          coverUrl = url.publicUrl
        }
      }

      // Upload preview
      let previewUrl = ''
      const { data: prevData } = await supabase.storage
        .from('beat-previews')
        .upload(`${slug}/preview.${previewFile.name.split('.').pop()}`, previewFile, { upsert: true })
      if (prevData) {
        const { data: url } = supabase.storage.from('beat-previews').getPublicUrl(prevData.path)
        previewUrl = url.publicUrl
      }

      if (!previewUrl) throw new Error('Preview upload failed')

      // Insert beat
      const { data: beat, error } = await supabase
        .from('beats')
        .insert({
          slug,
          title: form.title,
          bpm: parseInt(form.bpm),
          key: form.key,
          genre: form.genre,
          mood: form.mood,
          similar_artists: form.similar_artists.split(',').map(s => s.trim()).filter(Boolean),
          description: form.description,
          cover_art_url: coverUrl,
          preview_url: previewUrl,
        })
        .select()
        .single()

      if (error) throw error

      // Insert licenses
      const activeLicenses = licenses.filter(l => l.enabled)
      const { error: licError } = await supabase.from('licenses').insert(
        activeLicenses.map(l => ({
          beat_id: beat.id,
          tier: l.tier,
          label: DEFAULT_LICENSE_TIERS[l.tier as LicenseTier].label,
          price: l.price,
          files: DEFAULT_LICENSE_TIERS[l.tier as LicenseTier].files || [],
          streams: DEFAULT_LICENSE_TIERS[l.tier as LicenseTier].streams,
          distribution: DEFAULT_LICENSE_TIERS[l.tier as LicenseTier].distribution,
          monetization: DEFAULT_LICENSE_TIERS[l.tier as LicenseTier].monetization,
          credit: DEFAULT_LICENSE_TIERS[l.tier as LicenseTier].credit,
          content_id: DEFAULT_LICENSE_TIERS[l.tier as LicenseTier].content_id,
          is_exclusive: DEFAULT_LICENSE_TIERS[l.tier as LicenseTier].is_exclusive,
          description: DEFAULT_LICENSE_TIERS[l.tier as LicenseTier].description,
        }))
      )

      if (licError) throw licError

      toast.success(`"${form.title}" uploaded successfully!`)
      router.push('/admin/beats')
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-white text-xs font-mono tracking-widest uppercase mb-1">Admin</p>
            <h1 className="font-display text-4xl font-bold text-white">Upload Beat</h1>
          </div>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn-blue px-6 py-3 disabled:opacity-50"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-dark-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Save className="w-4 h-4" /> Publish Beat</>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {/* Cover + Preview Upload */}
          <div className="card-dark p-6">
            <h2 className="font-display font-semibold text-white mb-4">Files</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Cover art */}
              <label className="relative block">
                <div className={`border-2 border-dashed rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  coverPreview ? 'border-blue-500/40' : 'border-zinc-800 hover:border-zinc-700'
                } overflow-hidden`}>
                  {coverPreview ? (
                    <img src={coverPreview} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-zinc-600 mb-2" />
                      <span className="text-xs text-zinc-600">Cover Art</span>
                      <span className="text-[10px] text-zinc-700 mt-0.5">JPG, PNG, WEBP</span>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleCoverChange} className="sr-only" />
              </label>

              {/* Preview audio */}
              <label className="relative block">
                <div className={`border-2 border-dashed rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                  previewFile ? 'border-blue-500/40 bg-blue-dim' : 'border-zinc-800 hover:border-zinc-700'
                }`}>
                  {previewFile ? (
                    <div className="text-center px-3">
                      <div className="flex items-end gap-1 justify-center h-8 mb-2">
                        {[...Array(7)].map((_, i) => (
                          <div key={i} className="waveform-bar" style={{ height: `${[40,70,55,90,65,80,45][i]}%`, animationDelay: `${i*0.1}s` }} />
                        ))}
                      </div>
                      <span className="text-xs text-white truncate block max-w-full">{previewFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-zinc-600 mb-2" />
                      <span className="text-xs text-zinc-600">Preview Audio *</span>
                      <span className="text-[10px] text-zinc-700 mt-0.5">MP3 (watermarked)</span>
                    </>
                  )}
                </div>
                <input type="file" accept="audio/*" onChange={e => setPreviewFile(e.target.files?.[0] || null)} className="sr-only" />
              </label>
            </div>
          </div>

          {/* Beat info */}
          <div className="card-dark p-6 space-y-4">
            <h2 className="font-display font-semibold text-white mb-2">Beat Info</h2>

            <div>
              <label className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">Title *</label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Midnight Empire"
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500/60"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">BPM *</label>
                <input
                  type="number"
                  value={form.bpm}
                  onChange={e => setForm(f => ({ ...f, bpm: e.target.value }))}
                  placeholder="140"
                  className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500/60"
                />
              </div>
              <div>
                <label className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">Key *</label>
                <select
                  value={form.key}
                  onChange={e => setForm(f => ({ ...f, key: e.target.value }))}
                  className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500/60"
                >
                  {KEY_OPTIONS.map(k => <option key={k}>{k}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">Genre</label>
              <div className="flex flex-wrap gap-1.5">
                {GENRE_OPTIONS.map(g => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleTag(form.genre, g, v => setForm(f => ({ ...f, genre: v })))}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      form.genre.includes(g)
                        ? 'bg-blue-500/20 text-white border border-blue-500/40'
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">Mood</label>
              <div className="flex flex-wrap gap-1.5">
                {MOOD_OPTIONS.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleTag(form.mood, m, v => setForm(f => ({ ...f, mood: v })))}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                      form.mood.includes(m)
                        ? 'bg-blue-500/20 text-white border border-blue-500/40'
                        : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:text-zinc-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">Similar Artists</label>
              <input
                value={form.similar_artists}
                onChange={e => setForm(f => ({ ...f, similar_artists: e.target.value }))}
                placeholder="Drake, Future, Burna Boy (comma separated)"
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500/60"
              />
            </div>

            <div>
              <label className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest block mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={3}
                placeholder="Describe the vibe, influences, and feel of the beat..."
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500/60 resize-none"
              />
            </div>
          </div>

          {/* License pricing */}
          <div className="card-dark p-6">
            <h2 className="font-display font-semibold text-white mb-4">License Pricing</h2>
            <div className="space-y-3">
              {licenses.map((l, i) => (
                <div key={l.tier} className="flex items-center gap-4 py-2 border-b border-zinc-900 last:border-0">
                  <input
                    type="checkbox"
                    checked={l.enabled}
                    onChange={e => setLicenses(ls => ls.map((x, j) => j === i ? { ...x, enabled: e.target.checked } : x))}
                    className="accent-blue-500 w-4 h-4 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{DEFAULT_LICENSE_TIERS[l.tier as LicenseTier].label}</p>
                    <p className="text-[11px] text-zinc-600 font-mono">{l.tier}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-600 text-sm">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={l.price}
                      onChange={e => setLicenses(ls => ls.map((x, j) => j === i ? { ...x, price: parseFloat(e.target.value) } : x))}
                      disabled={!l.enabled}
                      className="w-24 bg-zinc-900 border border-zinc-800 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500/60 disabled:opacity-40 text-right"
                    />
                    <span className="text-zinc-600 text-xs">AUD</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn-blue w-full py-4 justify-center text-base disabled:opacity-50"
          >
            {saving ? 'Publishing...' : 'Publish Beat'}
          </button>
        </div>
      </div>
    </div>
  )
}
