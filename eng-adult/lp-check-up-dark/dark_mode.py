import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

replacements = {
    'bg-slate-50': 'bg-slate-950',
    'bg-white': 'bg-slate-900',
    'text-slate-900': 'text-white',
    'text-slate-800': 'text-slate-200',
    'text-slate-600': 'text-slate-300',
    'text-slate-500': 'text-slate-400',
    'border-slate-100': 'border-slate-800',
    'bg-slate-100': 'bg-slate-800',
    'shadow-slate-200': 'shadow-black/50',
    'bg-white/90': 'bg-slate-900/90',
    'border-slate-200': 'border-slate-700',
    'selection:bg-orange-100': 'selection:bg-orange-500 selection:text-white'
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Special fix for text-slate-900 which we changed to text-white, but might have missed some text-black or similar.
content = content.replace('text-slate-950', 'text-slate-50')

with open('src/App.tsx', 'w') as f:
    f.write(content)

print("Done replacing.")
