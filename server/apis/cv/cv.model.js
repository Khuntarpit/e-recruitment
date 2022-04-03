const mongoose = require('mongoose');

const cvSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: { type: String, default: null  },
    profile_address: { type: String, default: null  },
    email: { type: String, default: null  },
    phone: { type: String, default: null  },
    image: {
        type: Array, 
        default: []
    },
    degree: { type: String, default: null  },
    university: { type: String, default: null  },
    grade: { type: String, default: null  },
    year: { type: String, default: null  },
    company_name: { type: String, default: null  },
    job_title: { type: String, default: null  },
    start_date: { type: String, default: null  },
    end_date: { type: String, default: null  },
    details: { type: String, default: null },
    skill: { type: String, default: null  },
    objective: { type: String, default: null  },
    ref_name: { type: String, default: null  },
    ref_job_title: { type: String, default: null  },
    ref_company_name: { type: String, default: null  },
    ref_email: { type: String, default: null },
    ref_phone: { type: String, default: null },
    project_title: { type: String, default: null }, 
    project_desription: { type: String, default: null },
    help_tips: { type: String, default: null },
    experience:{type: String, default: null},
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('cv', cvSchema);