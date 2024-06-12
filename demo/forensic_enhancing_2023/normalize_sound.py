from pydub import AudioSegment

def match_target_amplitude(sound, target_dBFS):
	change_in_dBFS = target_dBFS - sound.dBFS
	return sound.apply_gain(change_in_dBFS)

audio_filenames = []
dirname = 'sounds/'

import os
for root, dirs, files in os.walk(dirname):
	for file in files:
		if file.endswith(".wav"):
			audio_filenames.append(os.path.join(root, file))

# Save output in file

for filename in audio_filenames:
	print(filename)
	sound = AudioSegment.from_file(filename, "wav")
	normalized_sound = match_target_amplitude(sound, -20.0)
	normalized_sound.export(filename, format="wav")