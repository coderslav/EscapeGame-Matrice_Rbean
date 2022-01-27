const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

module.exports = {
    hbsHelpers: {
        getDate: (data) => {
            return `${new Date(data[0].value).toLocaleDateString('fr-FR')}`;
        },
        getDuration: (value) => {
            return value.slice(0, 5);
        },
        slotToStr: (data) => {
            return `${new Date(data[0].value).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} - ${new Date(data[1].value).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
        },
        getMinCapacity: (data) => {
            return `${data[0].value}`;
        },
        getMaxCapacity: (data) => {
            return `${data[1].value}`;
        },
        capacityLoop: (capacity, block) => {
            var content = '';
            for (let i = capacity[0].value; i <= capacity[1].value; i += 1) content += block.fn(i);
            return content;
        },
        toJSON: (obj) => {
            return JSON.stringify(obj, null, 3);
        },
    },
};
